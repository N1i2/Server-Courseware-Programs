const http = require('http');
const url = require('url');
const fs = require('fs');
const readline = require('readline');
const database = require('./DB');
const PORT = 5000;

let db = new database.DB();
//start
let serverShutdownTimeout = null;
let commitInterval = null;
let statTimeout = null;
let statCollection = false;
let statStart = null;
let statEnd = null;
let requestsCount = 0;
let commitsCount = 0;

const stopServerAfter = (sec) => {
    if (serverShutdownTimeout) {
        clearTimeout(serverShutdownTimeout);
    }

    if (sec) {
        serverShutdownTimeout = setTimeout(() => {
            console.log(`Server stopped after ${sec} sec.`);
            process.exit(0);
        }, sec * 1000);
        serverShutdownTimeout.unref();
    }
}

const startCommitPeriodically = (sec) => {
    if (commitInterval) {
        clearInterval(commitInterval);
    }

    if (sec && sec >= 2) {
        commitInterval = setInterval(() => {
            db.commit()
            .then(data => {
                commitsCount = data.comCount;
                console.log(`Commit ${data.comCount}`);
            })
        }, sec * 1000);
        commitInterval.unref();
    }
}

const startStatCollection = (sec) => {
    statCollection = true;
    statStart = new Date();
    statEnd = null;
    requestsCount = 0;
    commitsCount = 0;

    statTimeout = setTimeout(() => {
        statCollection = false;
        statEnd = new Date ();
        console.log('Statistic collection stoped.');
    }, sec * 1000);
    statTimeout.unref();
}

const handleCommand = (command, param) => {
    switch (command) {
        case 'sd':
            stopServerAfter(param ? parseInt(param, 10) : null);
            break;
        case 'sc':
            startCommitPeriodically(param ? parseInt(param, 10) : null);
            break;
        case 'ss':
            if (param) {
                startStatCollection(param ? parseInt(param, 10) : null);
            } else {
                statCollection = false;
                statEnd = new Date ();
            }
            break;
        default:
            console.error('Unknkow command')
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    const [command, param] = input.trim().split(' ');
    handleCommand(command, param);
})
//bvubhukbhuvhuvbhuk
db.on('GET', (req, res) => {
    requestsCount += 1;

    console.log('GET');
    db.select().then((results) => {
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(results));
    });
});
db.on('POST', (req, res) => {
    requestsCount += 1;

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
    requestsCount += 1;
 
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
    requestsCount += 1;

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

    if(req.method === 'GET' && url.parse(req.url).pathname === '/api/ss') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            startTime: statStart,
            endTime: statEnd,
            requestsCount,
            commitsCount
        }));
        return;
    }
    else if (url.parse(req.url).pathname === '/') {
        let html = fs.readFileSync("./interfase.html", 'utf8');
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
        res.end(html);
    } else if (url.parse(req.url).pathname === "/api/db") {
        db.emit(req.method, req, res);
    }
}).listen(PORT, () => console.log(`Useing port: ${PORT}`));