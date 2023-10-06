import nodemailer from "nodemailer";




const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "k55sndw6fzyw3a7g@ethereal.email",
        pass: 'vy3zWVkBJTJMFVCmRR',
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
})
// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail(to: string, text: string) {
    // send mail with defined transport object

    const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: to, // list of receivers
        subject: "Hello ✔", // Subject line
        text: text, // plain text body
        html: text, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Message sent: %s", nodemailer.getTestMessageUrl(info));
}