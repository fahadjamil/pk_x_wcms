var ftpd = require('ftpd');
const configEnv =  require('./../config/config');

console.log('configEnv', configEnv);
var server;
var options = {
    host: '0.0.0.0',
    port: FTP_PORT,
    tls: null,
};
var uname = FTP_USER;
var pword = FTP_PASSWORD;

server = new ftpd.FtpServer(options.host, {
    getInitialCwd: function () {
        return '/downloads';
    },
    getRoot: function () {
        return process.cwd();
    },
    pasvPortRangeStart: 7003,
    pasvPortRangeEnd: 7003,
    tlsOptions: options.tls,
    allowUnauthorizedTls: true,
    useWriteFile: false,
    useReadFile: false,
    uploadMaxSlurpSize: 7000,
});

server.on('error', function (error) {
    console.log('FTP Server error:', error);
});

server.on('client:connected', function (connection) {
    var username = null;
    console.log('client connected: ' + connection.remoteAddress);
    connection.on('command:user', function (user, success, failure) {
        if (user === uname) {
            username = user;
            success();
        } else {
            failure('User Name Incorrect');
        }
    });

    connection.on('command:pass', function (pass, success, failure) {
        if (pass === pword) {
            success(username);
        } else {
            failure('Password Incorrect');
        }
    });
});

server.debugging = 4;
server.listen(options.port);
console.log('Listening on port ' + options.port);
