const express = require("express");
const { parseString } = require("xml2js");
const xmlBuilder = require("xmlbuilder");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const server = express();

const PORT = 5000;

const serverListen = server.listen(PORT, () => {
    console.log(`Using PORT: ${PORT}`);
})

server.get("/connection", (req, res) => {
    res.send(`KeepAliveTimeout = ${serverListen.keepAliveTimeout}`);
});

server.get("/connection/set=:set", (req, res) => {
    const newTimeout = parseInt(req.params.set, 10);

    if (isNaN(newTimeout)) {
        res.status(400).send(`KeepAliveTimeout = ${serverListen.keepAliveTimeout}`);
        return;
    }

    serverListen.keepAliveTimeout = newTimeout;
    res.send(`KeepAliveTimeout = ${serverListen.keepAliveTimeout}`);
});

server.get("/headers", (req, res) => {
    const reqHeaders = Object.entries(req.headers);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("test", "test");

    const resHeadres = Object.entries(res.getHeaders());

    let hrml = "<h1>Headers req and res</h1>";
    html += "<h2>Request</h2><ol>";

    reqHeaders.forEach(([key, value]) => {
        html += `<li>${key}: ${value}</li>`;
    });
    html += "<ol>";

    html += "<h2>Response</h2>";
    resHeadres.forEach(([key, value]) => {
        html += `<li>${key}: ${value}</li>`;
    });
    html += "<ol>";

    res.send(html);
});

server.get("/parametr", (req, res) => {
    const x = parseFloat(req.query.x);
    const y = parseFloat(req.query.y);

    if (!isNaN(x) && !isNaN(y)) {
        const sum = x + y;
        const diff = x - y;
        const prod = x * y;
        const quot = y !== 0 ? (x / y).toFixed(2) : "Error: y = 0";

        res.send(`
            <h1>Result where x=${x} and y=${y}</h1>
            <ul>
                <li>Sum=${sum}</li>
                <li>Diff=${diff}</li>
                <li>Prod=${prod}</li>
                <li>Quot=${quot}</li>
            </ul>   
        `);
        return;
    }

    res.status(400).send('<h1>Error with parametrs</h1>');
});

server.get("/parametr/:x/:y", (req, res) => {
    const x = parseFloat(req.query.x);
    const y = parseFloat(req.query.y);

    if (!isNaN(x) && !isNaN(y)) {
        const sum = x + y;
        const diff = x - y;
        const prod = x * y;
        const quot = y !== 0 ? (x / y).toFixed(2) : "Error: y = 0";

        res.send(`
            <h1>Result where x=${x} and y=${y}</h1>
            <ul>
                <li>Sum=${sum}</li>
                <li>Diff=${diff}</li>
                <li>Prod=${prod}</li>
                <li>Quot=${quot}</li>
            </ul>   
        `);
        return;
    }

    res.status(400).send(`<h1>Error with parameters</h1><p>URL: ${req.originalUrl}</p>`);
});

server.get("/close", (req, res) => {
    res.send("Server will be closed in 10 seconds");

    setTimeout(() => {
        server.close("Server is closed");
    }, 10000);
});

server.get("/socket", (req, res) => {
    const clientIp = req.socket.remoteAddress;
    const clientPort = req.socket.remotePort;

    const serverIp = req.socket.localAddress;
    const serverPort = req.socket.localPort;

    res.send(`
        <h1>Client</h1>
        <ul>
            <li>IP: ${clientIp}</li>
            <li>Port: ${clientPort}</li>
        </ul>    
        <h1>Server</h1>
        <ul>
            <li>IP: ${serverIp}</li>
            <li>Port: ${serverPort}</li>
        </ul>    
    `);
});

server.get("/req-data", (req, res) => {
    let html = "<ul>";
    let data = "";

    req.on("data", (chunk) => {
        data += chunk;
        html += `<li>${chunk} b</li>`;
    });

    req.on("end", () => {
        html += "</ul>";
        html += `<h2>Finaly we have ${data.length} b</h2>`;
        res.send(html);
    });

    req.on("error", (err) => {
        console.error(err);
        res.status(500).send("Error with data");
    });
});

//resp-status?code=404&mess=Page+not+found
server.get("/resp-status", (req, res) => {
    const code = parseInt(req.query.code, 10);
    const mess = req.query.mess || 'havent data';

    if (isNaN(code) || code < 100 || code > 599) {
        res.status(400).send("<h1>Error with parameters</h1>");
        return;
    }

    res.status(code).send(`
        <h1>Code: ${code}</h1>
        <p>Message: ${mess}</p>    
    `);
});

const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));

server.post("/formparameter", (req, res) => {
    const text = req.body.text || "havent data";
    const number = req.body.number || "havent data";
    const data = req.body.data || "havent data";
    const checkbox = req.body.checkbox ? "True" : "False";
    const radio = req.body.radio || "havent data";
    const textarea = req.body.textarea || "havent data";
    const submit = req.body.submit || "havent data";

    res.send(`
        <h1>Form data</h1>
        <ul>
            <li>Text: ${text}</li>
            <li>Number: ${number}</li>
            <li>Data: ${data}</li>
            <li>Checkbox: ${checkbox}</li>
            <li>Radio: ${radio}</li>
            <li>Textarea: ${textarea}</li>
            <li>Submit: ${submit}</li>
        </ul>    
    `);
});

/*
{
    __comment: 'request 8/10',
    "x": 4,
    "y": 5,
    "s": "laba",
    "m": ["one", "two", "three"],
    "o": {
        "surname": "Sialitsky",
        "name": "Nikolay"
    }
}
*/

server.use(bodyParser.json());
server.post("/json", (req, res) => {
    const reqData = req.body;
    const sum = reqData.x + reqData.y;
    const concat = `${reqData.s}: ${reqData.o.surname} ${reqData.o.name}`;
    const lengthM = reqData.m.length;

    const resData ={
        __comment: 'Work  task 8/10',
        x_plus_y: sum,
        Concat_s_o: concat,
        Length_m: lengthM
    }
    res.json(resData);
});

server.use(express.text({ type: "application/xml" }));

server.post("/xml", (req, res) => {
    let xmlData = req.body;

    parseString(xmlData, (err, result) => {
        if (err) {
            res.status(400).send("Error with XML");
            return;
        }

        const sum = 0;
        const mess = "";

        if(result.request && result.request.x) {
            const xElem = Array.isArray(result.request.x)? result.request.x : [result.request.x];    
            xElem.forEach((elem) => {
                sum += Number.parseInt(elem.$.value, 10) || 0;
            });
        }


        res.type("application/xml");
        res.send(xmlBuilder.create(resData).end({ pretty: true }));
    });
});