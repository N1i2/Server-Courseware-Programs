const http = require('http');
//var sendmail = require('sendmail')();
const nodemailer = require('nodemailer');
const fs = require('fs');
const url = require('url');
var PORT = 5000;
const key = 'ffup rhdh lubd eoes';

const send = (emailFrom, password, emailTo, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailFrom,
            pass: password,
        }
    });

    transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'Тестовое сообщение',
        html: message,
    }, (err, info) => {
        if (err) {
            console.error('Ошибка при отправке почты:', err);
        } else {
            console.log('Сообщение успешно отправлено:', info.response);
        }
    });
}

var server = http.createServer(function (request, response) {
    if (request.method === 'POST' && url.parse(request.url).pathname === '/send') {
        let body = '';
        request.on('data', function (chunk) { body += chunk.toString(); });

        request.on('end', function () {
            const {emailFrom, password, emailTo, message} = JSON.parse(body);

            send(emailFrom, password, emailTo, message);
        });
    }
    else {
        var html = fs.readFileSync('./06-02.html', 'utf8');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(html);
    }
});
server.listen(PORT, function () {
    console.log("Server is running at http://localhost:".concat(PORT));
});
