const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/html') {
        const filePath = path.join(__dirname, 'site.html');
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error: write file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Error: not found');
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порте - ${PORT}`);
});