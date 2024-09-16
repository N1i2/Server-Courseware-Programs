const http = require("http");
const fs = require("fs");
const path = require("path");

const  server = http.createServer((req,res) =>{
    if(req.url === '/png'){
        const filePath = path.join(__dirname, '/img.png');

        fs.readFile(filePath, (err, data) =>{
            if(err){
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.end("error: not read png");
            }
            else{
                res.writeHead(200, {"Content-Type": "image/png"});
                res.end(data);
            }
        })
    }
    else{
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end("error: not found url");
    }
});

const PORT = 5001;
server.listen(PORT, () =>{
    console.log(`Server: port = ${PORT}`);
})