'use strict'

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const http = require('http').Server(app);
const io = require('socket.io')(http);

const ejs = require('ejs');
const bodyParser = require('body-parser');

app.set('views', './static/view');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const os = require('os');
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const pty = require('node-pty');
io.on('connection', function(socket) {
    let ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.on('data', data => {
        socket.emit('output', data);
    });

    socket.on('input', data => {
        ptyProcess.write(data);
    });

    socket.on('resize', size => {
        ptyProcess.resize(size[0], size[1])
    });

    socket.on('disconnect', function() {
        console.log('a user disconnect');
    });

    console.log('a user connected');
});

app.get('/', (req, res) => {
    res.render('index.html');
});

http.listen(port, () => {
    console.log(`Server listening port: ${port}`);
});