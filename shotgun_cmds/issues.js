var request = require('request'),
    util = require('util');

exports.invoke = function (shell, options, done) {
    request(
        {
            url: 'https://api.github.com/repos/codetunnel/shotgun/issues',
            headers: {
                'User-Agent': 'request'
            }
        },
        function callback(error, response, body) {
            if (!error && response.statusCode === 200) {
                util.inspect(JSON.parse(body)).split('\n').forEach(function (line) {
                    shell.log(line, { dontType: true });
                });
            } else
                shell.error(error);
            done();
        }
    );
};
