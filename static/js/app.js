import Terminal from 'xterm';
import 'xterm/src/xterm.css';
import io from 'socket.io-client';

Terminal.loadAddon('fit');

const socket = io(window.location.href);
const term = new Terminal({
    cols: 80,
    rows: 24,
});

term.open(document.getElementById('#terminal'));

term.on('data', data => socket.emit('input', data));

term.on('resize', size => {
    socket.emit('resize', [size.cols, size.rows]);
});

socket.on('connect', () => console.log('connected'));

socket.on('disconnect', () => console.log('disconnected'));

socket.on('output', arrayBuffer => {
    term.write(arrayBuffer);
});

window.addEventListener('resize', () => {
    term.fit();
});

term.fit();