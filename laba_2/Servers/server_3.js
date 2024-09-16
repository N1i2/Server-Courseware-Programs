const http = require("http");

const  server = http.createServer((req,res) =>{
    if(req.url === '/api/name'){
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("Sialicky Nikolay Evgenievich");        
    }
    else{
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("error: not found url");
    }
});

const PORT = 5002;
server.listen(PORT, () =>{
    console.log(`Server: port = ${PORT}`);
})