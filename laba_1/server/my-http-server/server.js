const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {"Content-Type":"text/html"})
    res.end("<h1>Hello world</h1>");
});

const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`Server is running in port ${PORT}`);
})