var repl = require('repl');
var stream = require('stream');

process.repls = {};

exports.description = "Starts a node.js REPL.";

exports.usage = "[options]";

exports.options = {
  data: {
    hidden: true
  }
};

exports.invoke = function (shell, option) {
  var socket = shell.context.getVar('socket');
  var hasRepl = process.repls.hasOwnProperty(socket.id);
  
  if (!hasRepl || !options.data) {
    var inputStream = new stream.PassThrough();
    var ouptutStream = new stream.PassThrough();

    outputStream.on('data', function (data) {
      if (data !== null) {
        data.toString().split('\n').forEach(function (line) {
          if (!/^\s*$/.test(line)) {
            shell.log(line.replace(/\n/g, ''), { dontType: true });
          }
        });
      }
    });

    var replInstance = repl.start({
      prompt: '',
      ignoreUndefined: true,
      input: inputStream,
      output: outputStream
    });

    var clearCmd = replInstance.commands['.clear'];
    var exitCmd = replInstance.commands['.exit'];
    var oldClearAction = clearCmd.action;
    var oldExitAction = exitCmd.action;

    clearCmd.action = function () {
      shell.clear();
      oldClearAction.call(this);
      replInstance.context.shell = shell;
    };

    exitCmd.action = function () {
      shell.clearPrompt();
      oldExitAction.call(this);
    };

    replInstance.context.shell = shell;

    process.repls[socket.id] = { input: inputStream, output: outputStream };

    socket.on('disconnect', function () {
      delete process.repls[socket.id];
    });

    shell.setPrompt('data', 'repl', {}, "REPL");
  }
  else if (options.data && hasRepl) {
    shell.log("> " + options.data, { dontType: true });
    process.repls[socket.id].input.write(options.data + '\n');
    if (options.data !== '.exit') {
      delete options.data;
      shell.setPrompt('data', 'repl', {}, "REPL");
    }
  }
};
