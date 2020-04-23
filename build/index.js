"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandArgumentType;
(function (commandArgumentType) {
    commandArgumentType["text"] = "text";
    commandArgumentType["argument"] = "argument";
})(commandArgumentType = exports.commandArgumentType || (exports.commandArgumentType = {}));
var commandArgumentArgumentValueType;
(function (commandArgumentArgumentValueType) {
    commandArgumentArgumentValueType["any"] = "any";
    commandArgumentArgumentValueType["string"] = "string";
    commandArgumentArgumentValueType["integer"] = "integer";
    commandArgumentArgumentValueType["custom"] = "custom";
})(commandArgumentArgumentValueType = exports.commandArgumentArgumentValueType || (exports.commandArgumentArgumentValueType = {}));
var commandArgument = /** @class */ (function () {
    function commandArgument(type, needed, other) {
        if (needed === void 0) { needed = true; }
        if (other === void 0) { other = {}; }
        this.needed = true;
        this.other = {};
        this.type = type;
        this.needed = needed;
        this.other = other;
        switch (this.type) {
            case commandArgumentType.text:
                if (typeof this.other.value !== "string") {
                    throw null; //WIP
                }
                break;
            case commandArgumentType.argument:
                if (typeof this.other.name !== "string") {
                    throw null; //WIP
                }
                if (typeof this.other.multispace !== "boolean") {
                    this.other.multispace = false;
                }
                break;
            default:
                throw null; //WIP
                break;
        }
    }
    return commandArgument;
}());
exports.commandArgument = commandArgument;
var cmd = /** @class */ (function () {
    function cmd(cmdArguments, onRun, name) {
        if (name === void 0) { name = null; }
        this.name = null;
        this.cmdArguments = cmdArguments;
        this.onRun = onRun;
    }
    cmd.prototype.generateSyntax = function () {
        var out = "";
        for (var a = 0; a < this.cmdArguments.length; a++) {
            var b = "";
            switch (this.cmdArguments[a].type) {
                case commandArgumentType.text:
                    b = this.cmdArguments[a].other.value;
                    break;
                case commandArgumentType.argument:
                    b = "[" + this.cmdArguments[a].other.name + "]";
                    break;
                default:
                    throw null; //WIP
                    break;
            }
            out = out + (a === 0 ? "" : " ") + (this.cmdArguments[a].needed ? b : "(" + b + ")");
        }
        return out;
    };
    return cmd;
}());
exports.cmd = cmd;
var foundCmdValue;
(function (foundCmdValue) {
    foundCmdValue[foundCmdValue["nothing"] = 0] = "nothing";
    foundCmdValue[foundCmdValue["syntaxErr"] = 1] = "syntaxErr";
    foundCmdValue[foundCmdValue["good"] = 2] = "good";
})(foundCmdValue || (foundCmdValue = {}));
var commandInput = /** @class */ (function () {
    function commandInput(commands, onError) {
        this.allCommands = commands;
        this.onError = onError;
    }
    commandInput.prototype.run = function (str, optionsToCmd) {
        if (optionsToCmd === void 0) { optionsToCmd = null; }
        var strArr = str.split(' ');
        var found = null;
        var foundValue = foundCmdValue.nothing;
        var foundValueErr = null;
        var values;
        for (var a = 0; a < this.allCommands.length && foundValue !== foundCmdValue.good; a++) {
            values = {};
            var wrongCmd = false;
            var b = 0;
            var c = 0;
            while ((b < this.allCommands[a].cmdArguments.length || c < strArr.length) && wrongCmd === false) {
                if (b < this.allCommands[a].cmdArguments.length && c < strArr.length) { // normal
                    switch (this.allCommands[a].cmdArguments[b].type) {
                        case commandArgumentType.text:
                            if (this.allCommands[a].cmdArguments[b].other.value === strArr[c]) {
                            }
                            else if (this.allCommands[a].cmdArguments[b].needed === false) {
                                c--;
                            }
                            else {
                                wrongCmd = true;
                            }
                            break;
                        case commandArgumentType.argument:
                            values[this.allCommands[a].cmdArguments[b].other.name] = strArr[c];
                            break;
                        default:
                            throw null; //WIP
                            break;
                    }
                }
                else if (b < this.allCommands[a].cmdArguments.length) { // input text to short
                    if (this.allCommands[a].cmdArguments[b].needed === true) {
                        found = this.allCommands[a];
                        foundValue = foundCmdValue.syntaxErr;
                        foundValueErr = "last Argument was needed";
                        wrongCmd = true;
                    }
                }
                else { // input text too long
                    if (this.allCommands[a].cmdArguments[b - 1].type === commandArgumentType.argument) {
                        if (this.allCommands[a].cmdArguments[b - 1].other.multispace === true) {
                            values[this.allCommands[a].cmdArguments[b - 1].other.name] += " " + strArr[c];
                        }
                        else {
                            found = this.allCommands[a];
                            foundValue = foundCmdValue.syntaxErr;
                            foundValueErr = "last Argument was not multispace";
                            wrongCmd = true;
                        }
                    }
                    else {
                        wrongCmd = true;
                    }
                }
                if (b < this.allCommands[a].cmdArguments.length)
                    b++;
                c++;
            }
            if (wrongCmd === false) {
                found = this.allCommands[a];
                foundValue = foundCmdValue.good;
                foundValueErr = null;
            }
        }
        switch (foundValue) {
            case foundCmdValue.nothing:
                this.onError("no cmd found", null, str, optionsToCmd);
                break;
            case foundCmdValue.syntaxErr:
                this.onError("syntax error", { cmd: found, err: foundValueErr }, str, optionsToCmd);
                break;
            case foundCmdValue.good:
                if (found !== null) {
                    found.onRun(values, optionsToCmd);
                }
                else {
                    throw null; //WIP
                }
                break;
        }
    };
    return commandInput;
}());
exports.commandInput = commandInput;
