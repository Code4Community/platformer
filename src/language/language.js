export { tokenize, parse, run };

/*
 * Tokens: TIMES FOREVER END IF ELIF ELSE NUMBER IDENTIFIER
 * Grammar:
 *
 */

var input;
var level = 1;
var error = false;

// tokenizer

function tokenize(array) {
  var keywords = ["times", "forever", "end", "if", "elif", "else"];
  for (var i = 0; i < array.length; i++) {
    if (
      !isNaN(array[i]) ||
      keywords.includes(array[i]) ||
      findSymbol(array[i]) ||
      conditions.includes(array[i])
    ) {
      continue;
    } else {
      // Error
      showAlert(array[i] + " is invalid.");
      return false;
    }
  }
  return true;
}

// parser

var conditions = ["rustle", "boom", "wind", "true", "false"];
var lang = [
  {
    symbol: "skip",
    action: () => {
      console.log("Skip");
    },
  },
  {
    symbol: "moveleft",
    action: () => {
      console.log("Moving left");
    },
  },
  {
    symbol: "moveright",
    action: () => {
      console.log("Moving right");
    },
  },
];

function parse(array) {
  error = false;
  if (array.length == 1 && array[0] == "") {
    return;
  }
  parseSequence(array);
  if (!error && array.length != 0) {
    showAlert("Too many ends.");
    error = true;
  }
}

function parseSequence(array) {
  while (array.length > 0) {
    if (error) {
      return;
    }
    if (["end", "elif", "else"].includes(array[0])) {
      return;
    }
    parseCommand(array);
  }
}

function parseCommand(array) {
  var command = array[0];
  if (command == "if") {
    parseIf(array);
  } else if (command == "forever") {
    parseInfinite(array);
  } else if (!isNaN(command)) {
    parseLoop(array);
  } else if (findSymbol(command)) {
    parseStatement(array);
  } else {
    showAlert(command + " is not a valid command.");
    error = true;
    return;
  }
}

function parseIf(array) {
  //get rid of if
  var token = array.shift();
  var cond = array.shift();
  if (!cond) {
    showAlert("Missing condition.");
    error = true;
    return;
  }
  if (!conditions.includes(cond)) {
    showAlert(cond + " is not a valid condition.");
    error = true;
    return;
  }
  parseSequence(array);
  if (array[0] == "elif") {
    parseElif(array);
  }
  if (array[0] == "else") {
    array.shift();
    parseSequence(array);
  }
  if (array[0] != "end") {
    showAlert("Missing end.");
    error = true;
    return;
  }
  array.shift();
}

function parseElif(array) {
  array.shift();
  var cond = array.shift();
  if (!cond) {
    showAlert("Missing condition.");
    error = true;
    return;
  }
  if (!conditions.includes(cond)) {
    showAlert(cond + " is not a valid condition.");
    error = true;
    return;
  }
  parseSequence(array);
  if (array[0] == "elif") {
    parseElif(array);
  }
}

function parseLoop(array) {
  //gets rid of number
  array.shift();
  if (array[0] != "times") {
    showAlert("Missing times.");
    error = true;
    return;
  }
  //gets rid of times
  array.shift();
  parseSequence(array);
  if (array[0] != "end") {
    showAlert("Missing end.");
    error = true;
    return;
  }
  array.shift();
}

function parseInfinite(array) {
  // Get rid of forever
  array.shift();
  parseSequence(array);
  if (array[0] != "end") {
    showAlert("Missing end.");
    error = true;
    return;
  }
  array.shift();
}

function parseNumber(array) {
  var number = array.shift();
  return parseInt(number);
}

function parseStatement(array) {
  var statement = array.shift();
  var symbol = findSymbol(statement);
}

function findSymbol(sym) {
  for (var symbol of lang) {
    if (symbol.symbol === sym) {
      return symbol;
    }
  }
  return false;
}

// evaluator

// TODO: Change to add reference to game (to evaluate condition within game)
function evaluate(condition) {
  if (condition === "false") {
    return false;
  } else {
    return true;
  }
}

function run(array) {
  if (false) {
    // TODO: Should be changed to game.done() or something
    throw { name: "GameEnded", message: "Game has ended." };
  }

  for (var i = 0; i < array.length; i++) {
    var x = findSymbol(array[i]);
    if (x) {
      x.action();
    } else if (array[i] === "if") {
      i += runIf(array, i);
    } else if (array[i] === "forever") {
      i += runInfinite(array, i);
    } else if (!isNaN(array[i])) {
      i += runTimes(array, i);
    }
  }
}

function runIf(array, start) {
  // Get parts of the if statement
  // Make this the indices of the special words of if statement like elif" "else" "end"
  var index = findIfSections(array, start + 2);
  index.unshift(start);

  var sections = [];
  for (var i = 0; i < index.length - 1; i++) {
    var object = {
      condition: "",
      start: 0,
      end: index[i + 1] - 1,
    };

    if (array[index[i]] == "else") {
      object.start = index[i] + 1;
    } else {
      object.condition = array[index[i] + 1];
      object.start = index[i] + 2;
    }
    sections.push(object);
  }

  for (var section of sections) {
    if (evaluate(section.condition)) {
      run(array.slice(section.start, section.end + 1));
      break;
    }
  }

  // Return how many indices to skip over
  return index[index.length - 1] - start;
}

function runTimes(array, start) {
  // Get end of the times loop
  var endIndex = findMatchingEnd(array, start + 2);

  // Run it x times
  var times = parseInt(array[start]);
  var body = array.slice(start + 2, endIndex); // Slice creates a new copy so safe
  for (var i = 0; i < times; i++) {
    run(body);
  }

  // Return how many indices to skip over
  return endIndex - start;
}

function runInfinite(array, start) {
  // Get end of the times loop
  var endIndex = findMatchingEnd(array, start + 1);

  // Run it forever
  var body = array.slice(start + 1, endIndex); // Slice creates a new copy so safe
  while (true) {
    run(body);
  }

  // Return how many indices to skip over
  return endIndex - start;
}

// Returns the ending index of the matching "end", starting at index
// Do not include the starting tag (the "times" or the "if" that we are finding the
// matching "end" of)
function findMatchingEnd(array, index) {
  var level = 0;
  var done = false;
  while (!done) {
    switch (array[index]) {
      case "if":
      case "times":
        level++;
        break;
      case "end":
        level--;
        if (level === -1) {
          done = true;
        }
        break;
      default:
        break;
    }
    index++;
  }
  return index - 1;
}

function findIfSections(array, index) {
  var level = 0;
  var done = false;
  var output = [];

  while (!done) {
    switch (array[index]) {
      case "if":
      case "times":
        level++;
        break;
      case "end":
        level--;
        if (level === -1) {
          output.push(index);
          done = true;
        }
        break;
      case "else":
        if (level === 0) {
          output.push(index);
        }
        break;
      case "elif":
        if (level === 0) {
          output.push(index);
        }
        break;
      default:
        break;
    }
    index++;
    if (index > array.length) {
      //Error
      break;
    }
  }
  return output;
}
