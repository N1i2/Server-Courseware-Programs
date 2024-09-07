const http = require('http');

const server = http.createServer((req, res) => {
    const method = req.method;
    const uri = req.url; 
    const version = req.httpVersion;
    const headers = req.headers;
    
    let body = '';
    req.on('data', chunk => { 
        body += chunk.toString();
    });

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const responseHTML = `
        <html>
        <head>
            <title>Response from my server</title>
        </head>
        <body>
            <h1>Hello world</h1>
            <p><strong>Method: </strong>${method}</p>
            <p><strong>URI: </strong>${uri}</p>
            <p><strong>HTTP version: </strong>${version}</p>
            <h2>Headers: </h2>
            <pre>${JSON.stringify(headers, null, 2)}</pre>
            <h2>Body: </h2>
            <pre>${body || 'Empty'}</pre>
        </body>
        </html>
        `;

        res.end(responseHTML);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});