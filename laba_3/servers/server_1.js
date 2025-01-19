const http = require('http');
const PORT = 5000;

let currentState = 'norm';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<h1>${currentState}</h1>`);
}).listen(PORT, () => {
    console.log(`Using Port: ${PORT}`);
    process.stdout.write('Enter the state (norm, stop, test, idle, or exit): ');
});

function handleInput(input) {
    if (input === 'exit') {
        console.log('Server is closing...');
        server.close();
        process.exit();
    } else if (['norm', 'stop', 'test', 'idle'].includes(input)) {
        currentState = input;
        console.log(`Go to: ${currentState}`);
    } else {
        console.log('Error: State not faund.');
    }
    process.stdout.write('Enter the state (norm, stop, test, idle, or exit): ');
}

process.stdin.on('data', (data) => {
    handleInput(data.toString().trim().toLowerCase());
});
