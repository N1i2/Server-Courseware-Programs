const http = require('http');
const url = require('url');
const fs = require('fs');
const {staticFileRequest} = require('./m07-01');

const PORT = 5000;
const STATIC_DIR = './static';

http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname;

    if(req.method === 'GET' && pathname === '/server'){
        const html = fs.readFileSync('./index.html', 'utf8');
        res.writeHead(200, {'Content-Type':'text/html; charset=utf8'})
        res.end(html);
    }
    else if(req.method === 'GET'){
        staticFileRequest(STATIC_DIR, pathname, res);
    }
    else{
        res.writeHead(405, {'Content-Type':'text/plain'})
        res.end('Error 405:Method not allowed');
    }
}).listen(PORT, ()=>{
    console.log(`USING PORT = ${PORT}`);
});