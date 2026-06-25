const User = require("../models/user");
const OTP = require("../models/otp")
const { sendBookingEmail, sendOtpEmail } = require("../utils/email")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

//token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

//Register User

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPass, role: 'user', isVerified: false });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`otp for ${email} : ${otp}`);

        await OTP.create({ email, otp, action: "account_verification" });
        await sendOtpEmail(email, otp, "account_verification")
        res.status(201).json(
            {
                message: "user registered successfully. Please check your email for OTP verification",
                email: user.email
            });


    }
    catch (err) {
        res.status(400).json({ err: err.message });
    }
}

//Login User

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials! Please sign up' });
        }

        if (role && user.role !== role) {
            return res.status(400).json({ error: `Not registered as an ${role}` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified && user.role === 'user') {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await OTP.deleteMany({ email, action: 'account_verification' });
            await OTP.create({ email, otp, action: 'account_verification' });
            await sendOtpEmail(email, otp, 'account_verification')
            return res.status(400).json({
                error: "account not verified. A new OTP has been sent to your email",
            })
        }
        res.json({
            message: 'Login Successful',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        })
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

//verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp, action: "account_verification" });
    if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' })
    }

    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    await OTP.deleteMany({ email, action: "account_verification" });
    res.json({
        message: "account verified successfully! You can now LogIn",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
    })
}

// Resend OTP
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Delete old OTP
        await OTP.deleteMany({ email, action: "account_verification" });

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`new otp for ${email} : ${otp}`);

        await OTP.create({ email, otp, action: "account_verification" });
        await sendOtpEmail(email, otp, "account_verification");

        res.json({
            message: "New OTP has been sent to your email",
            email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { registerUser, loginUser, verifyOtp, resendOtp }