const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/xmlhttprequest') {
        const filePath = path.join(__dirname, 'xmlhttprequest.html');
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error: unable to read the file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/api/name') {
        const person = {
            lastName: 'Sialicky',
            firstName: 'Nikolay',
            patronymic: 'Evgenievich'
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(person));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Error: not found');
    }
});

const PORT = 5003;
server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});
