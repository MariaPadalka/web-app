const nodemailer = require('nodemailer')

class MailService{
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }
    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to : to,
            subject: 'Account activation ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1> Account Activation</h1>
                        <p>Thank you for registering with our application.</p>
                        <p>To activate your account, please follow the link below:</p>
                        <a href="${link}"> Activate Account </a>
                    </div>
                `
        })
    };
}
module.exports = new MailService();