const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000,
});

const sendOtpEmail = async (email, otp, type) => {
    try {
        const title = type === "account_verification" ? "verify your Veno account" : "Veno Booking verified";
        const msg = type === "account_verification"
            ? "Plase use the following OTP your new account"
            : "Plase use the following OTP verify and confirm your event booking"
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; text-align: center;">
                        
                        <h2 style="color: #333;">OTP Verification</h2>
                        
                        <p style="color: #555; font-size: 16px;">
                            Use the OTP below to complete your verification process.
                        </p>
                        
                        <div style="font-size: 28px; font-weight: bold; color: #06779B; margin: 20px 0;">
                            ${otp}
                        </div>
                        
                        <p style="color: #888; font-size: 14px;">
                            This OTP is valid for a limited time. Do not share it with anyone.
                        </p>

                        <hr style="margin: 20px 0;" />

                        <p style="color: #aaa; font-size: 12px;">
                            If you didn’t request this, you can ignore this email.
                        </p>

                    </div>
                </div>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Otp sent to ${email} for ${type} : ${otp}`);
    } catch (err) {
        console.log(`error sending OTP to ${email} for ${type}: `, err);
    }
}

const sendBookingEmail = async (email, otp, event) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Booking Confirmed: ${event}`,
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 10px;">
                    <h2 style="color: #06779B; text-align: center;">🎉 Booking Confirmed!</h2>
                    <p style="color: #333; font-size: 16px;">
                        Your booking for <strong>${event}</strong> has been successfully confirmed.
                    </p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Event:</strong> ${event}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> Confirmed ✅</p>
                    </div>
                    <p style="color: #555; font-size: 15px;">
                        Please use the OTP below for verification at the event:
                    </p>
                    <div style="font-size: 30px; font-weight: bold; color: #06779B; text-align: center; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #888; font-size: 14px; text-align: center;">
                        Keep this OTP safe. It may be required during entry.
                    </p>
                    <hr style="margin: 25px 0;" />
                    <p style="color: #aaa; font-size: 12px; text-align: center;">
                        If you did not make this booking, please ignore this email.
                    </p>
                </div>
            </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Booking email sent to ${email} for ${event}`);

    } catch (err) {
        console.log(`Error sending email to ${email} for ${event}:`, err);
    }
};


module.exports = { sendBookingEmail, sendOtpEmail };