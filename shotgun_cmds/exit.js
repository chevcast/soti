exports.invoke = function (shell, options, done) {
  shell.context.getVar('socket').emit('exit', function () {
    console.log("Shutting down web server.");
    process.exit(0);
  });
};
