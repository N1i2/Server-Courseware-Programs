const http = require('http');
const url = require('url');
const fs = require('fs');
const database = require('./DB');
const PORT = 5000;

let db = new database.DB();

db.on('GET', (req, res) => {
    console.log('GET');
    db.select().then((results) => {
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(results));
    });
});
db.on('POST', (req, res) => {
    console.log('POST');
    req.on('data', (data) => {
        let r = JSON.parse(data);

        console.log(r);

        if (r.id === '' || r.name === '' || r.bday === '') {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'Empty area'}));
            return;
        }
        if (!checkDate(r.bday)) {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'Error date'}));
            return;
        }

        db.insert(r).then(data => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        }).catch(err => {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(err));
        });
    });
});
db.on('PUT', (req, res) => {
    console.log('PUT');
    req.on('data', (data) => {
        let r = JSON.parse(data);

        if (r.id === '' || r.name === '' || r.bday === '') {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'Error: Empty area'}));
            return;
        }
        if (!checkDate(r.bday)) {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'Error: Data'}));
            return;
        }

        db.update(r).then(data => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        }).catch(err => {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(err));
        });

    });
});
db.on('DELETE', (req, res)=>{
    console.log('DELETE');
    req.on('data', (data)=>{
        let r = JSON.parse(data);

        if(r.id === '' || r.name === '' || r.bday === ''){
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({error: 'Error: empty area'}));
            return;
        }

        db.delete(r.id).then((data) => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(data));
        }).catch((err) => {
            res.writeHead(400, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(err));
        });
    });
});

let checkDate = (date) => {
    let pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
    let new_date = date.replace(pattern,'$3-$2-$1');
    return new Date(new_date) <= new Date();
}

http.createServer((req, res) => {
    if (url.parse(req.url).pathname === '/') {
        let html = fs.readFileSync("./interfase.html", 'utf8');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        res.end(html);
    } else if (url.parse(req.url).pathname === "/api/db") {
        db.emit(req.method, req, res);
    }
}).listen(PORT, () => console.log(`Useing port: ${PORT}`));