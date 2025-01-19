const http = require('http');
const url = require('url');
const PORT = 5002;

const factorial = (num) => num <= 1 ? num : num * factorial(num - 1);

http.createServer((req, res) => {
    const qObj = url.parse(req.url, true).query;
    let k = qObj.k;
    let htmlContent = '';

    if (url.parse(req.url).pathname == '/fact') {
        if (k !== 'x') {
            k = parseInt(k, 10);

            if (isNaN(k) || k < 0) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Error with number "k"(k<0 ir k>10 or k is not a number).');
                return;
            }
        }

        htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Factorial</title>
    </head>
    <body>
    `;

        if (k === 'x') {
            for (let x = 1; x <= 20; x++) {
                const start = Date.now();
                const res = factorial(x);
                const time = (Date.now() - start);

                htmlContent += `
            <h1>${time})k: ${x}; fact: ${res}</h1>
            `;
            }
        }
        else {
            const start = Date.now();
            const res = factorial(k);
            const time = (Date.now() - start);
            htmlContent += `
            <h1>${time})k: ${k}; fact: ${res}</h1>
        `;
        }

        htmlContent += `
    </body>
    </html>
    `;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>Not Found</h1>');
    }

}).listen(PORT, () => {
    console.log(`Useing Port ${PORT}`);
});
