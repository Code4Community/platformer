import CodeMirror from 'codemirror'

// Constants
var EDITOR_ID = "editor"

var editor;
var indent = 0;

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

editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    mode: "mode"
});


// Page Setup
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;

// Set CodeMirror size
editor.setSize(Math.floor(windowWidth - canvas.width), canvas.height);