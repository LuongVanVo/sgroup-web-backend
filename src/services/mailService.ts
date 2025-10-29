import nodemailer from 'nodemailer';

export const sendActivationEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    return await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html
    })
}