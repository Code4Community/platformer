// The below two lines are magical imports.  There appears to be a small bug in CodeMirror requiring it to be imported this way when using webpack.
// DO NOT TOUCH PLEASE :-)
import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/addon/mode/simple.js';


// Constants
var EDITOR_ID = "editor"

// DOM Elements
var textArea = document.getElementById(EDITOR_ID);

// CodeMirror Setup
CodeMirror.defineSimpleMode("mode", {
    start: [
        { regex: /(?:if|times)\b/, token: "control", indent: true},
        { regex: /(?:elif|else)\b/, token: "control", dedent: true, indent: true},
        { regex: /(?:end)\b/, token: "control", dedent: true},
        { regex: /(?:moveleft|moveright|skip)\b/, token: "statement"},
        { regex: /(?:rustle|boom|wind)\b/, token: "condition"},
        { regex: /(?:[1-9][0-9]*)\b/, token: "digits"},
    ],
    meta: {
        electricInput: /elif|else|end/
    }
});

CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: "mode"
});