const http = require('http');
const url = require('url');

const PORT = 5003;

const factorial = (num) => num <= 1 ? num : num * factorial(num - 1);

http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;
    if (path === '/fact') {
        const param = url.parse(req.url, true).query.k;

        if (param != null && Number.isInteger(parseInt(param, 10))) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            process.nextTick(() => res.end(JSON.stringify({
                k: parseInt(param, 10),
                fact: factorial(parseInt(param, 10))
            })));
        }
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Not found</h1>')
    }

}).listen(
    PORT,
    () => console.log(`Useing Port: ${PORT}`)
);