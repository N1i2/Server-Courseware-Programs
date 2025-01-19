const fs = require('fs');
const path = require('path');

const ALL_TYPES = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'png': 'image/png',
    'docx': 'application/msword',
    'json': 'application/json',
    'xml': 'application/xml',
    'mp4': 'video/mp4',
};

function staticFileRequest(root, reqPath, res){
    const filePath = path.join(root, reqPath);
    const ext = path.extname(filePath).slice(1);

    if(!ALL_TYPES[ext]){
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Error 404: Type not found');
        return; 
    }

    fs.readFile(filePath, (err, data) => {
        if(err){
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Error 404: File not found');
            return; 
        }

        res.writeHead(200, {'Content-Type': ALL_TYPES[ext]});
        res.end(data);
    });
}

module.exports = { staticFileRequest };