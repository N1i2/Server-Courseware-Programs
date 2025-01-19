import nodemailer from 'nodemailer';

const send = (message) => {
    const emailFrom = 'nikkollass27@gmail.com';
    const password = 'ffup rhdh lubd eoes';
    const emailTo = 'nikkollass27@gmail.com';

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

export default send;