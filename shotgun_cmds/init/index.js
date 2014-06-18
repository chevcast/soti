var fs = require('fs'),
    path = require('path');

// Dont' show in help menu.
exports.hidden = true;

// A short description of what this command module does. Displayed in help.
exports.description = "The initialize command that is run when the application first loads.";

// The function that should run when the command is invoked.
exports.invoke = function (shell, options) {
    var welcomeBanner = fs.readFileSync(path.join(__dirname, 'welcome.txt')).toString();
    var index = 0;
    welcomeBanner.split('\n').forEach(function (line) {
        shell.log(line, { dontType: true });
    });
};
