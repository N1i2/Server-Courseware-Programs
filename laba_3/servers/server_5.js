const http = require('http');
const url = require('url');
const PORT = 5004;

const factorial = (num) => num <= 1 ? num : num * factorial(num - 1);

http.createServer((request, response) => {
    const path = url.parse(request.url).pathname;
    if (path === '/fact') {
        const param = url.parse(request.url, true).query.k;

        if (param != null && Number.isInteger(parseInt(param, 10))) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            setImmediate(() => response.end(JSON.stringify({
                k: parseInt(param, 10),
                fact: factorial(parseInt(param, 10))
            })));

        }
    }
    else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end('<h1>Not found</h1>')
    }
}).listen(
    PORT,
    () => console.log(`Useing Port: ${PORT}`)
);