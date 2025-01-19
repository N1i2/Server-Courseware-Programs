const http = require('http');
const url = require('url');
const PORT = 5001;

const factorial = (num) => num <= 1 ? num : num * factorial(num - 1);


const server = http.createServer((req, res) => {
    const qObj = url.parse(req.url, true).query;
    const k = parseInt(qObj.k, 10);

    if (isNaN(k) || k < 0 || k > 10) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Error with number "k"(k<0 ir k>10 or k is not a number).');
        return;
    }

    const fact = factorial(k);
    const ansver = { k, fact };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ansver));
}).listen(PORT, () => {
    console.log(`Useing Port ${PORT}`);
});
