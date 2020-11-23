const nodemailer = require('nodemailer')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const signupMail = (data, host, protocol) => {
    const maxAge = 3 * 60 * 60

    const TOKEN = jwt.sign({ id: data._id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
    const PORT = process.env.PORT || 3000
    const link = `${protocol}://${host}:${PORT}/user/verify/${data._id}?tkn=${TOKEN}`

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL, //email id

            pass: process.env.NODEMAILER_PASSWORD, // gmail password
        },
    })
    var mailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: `${data.email}`,
        subject: 'Please confirm your Email account',
        html:
            'Hello,<br> Please here to verify your email.<br><a href=' +
            link +
            '>Click here to verify</a>',
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error', error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

const contactMail = (issue, type) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL, //email id

            pass: process.env.NODEMAILER_PASSWORD, // gmail password
        },
    })
    const userContent = `Hello, ${issue.name}.<br> 
    We have received your issue stating - <br> "${issue.message}" 
    We are working on it and shall resolve it soon. <br>
    Thank you!`;
    const adminContent = `A new Report has been issued.<br>
    <p>Name - ${issue.name}</p><br>
    <p>Email Id - ${issue.email}</p><br>
    <p>Subject - ${issue.subject}</p><br>
    <p>Message - ${issue.message}</p>`;
    const response = {
        user : {
            from : process.env.NODEMAILER_EMAIL,
            to : `${issue.email}`,
            subject : `Records - ${issue.subject}`,
            html : userContent
        },
        admin:{
            from : process.env.NODEMAILER_SECONDARYEMAIL,
            to : process.env.NODEMAILER_EMAIL,
            subject : 'New Issue Found',
            html : adminContent
        }
    }
    
    var mailOptions = {
        from: response[type].from,
        to : response[type].to,
        subject : response[type].subject,
        html : response[type].html
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error', error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}

module.exports = {
    signupMail,
    contactMail
}
