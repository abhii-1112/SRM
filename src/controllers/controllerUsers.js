import Users from "../models/users.js";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//create a transporter to send mails




//Get user by ID
export async function getUserbyID(req, res) {
    const { id } = req.params

    try {
        const user = await Users.findById(id)
        return res.json(user);

    } catch (error) {
        return res.status(500).json({ message: `error retrieving user by ID`, error })
    }

}

//Get all Users
export async function getAllUsers(req, res) {

    try {
        const users = await Users.find();
        return res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving users', error });
    }

}

//create new user
export async function createUser(req, res) {

    const { name, email, password } = req.body;
    try {
        const user = await Users.findOne({ email})
        if (user) {
            return res.status(400).json({ success: false, message: `User with ${email} already exists` });
        }
        

        const new_user = new Users({
            name: name,
            email: email,
            password: password
        });
        await new_user.save();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
    return res.status(200).json({ success: true, message: ` created successfully` })
}

//login user
export async function loginUser(req, res) {
    const {email, password} = req.body;
    
    try {
        const user = await Users.findOne({ email });
        if (!user){
            console.log(user);
            return res.status(404).json({success: false, message: `User with ${email} does not exists`});
        }

        //check if passowrd match
        
        const isMatch = user.comparePassword(password)

        if (!isMatch){
            return res.status(404).json({success: false, message: `password or email are incorrect`});
        }
        const token = jwt.sign({email: email},"asdfghjkl",{expiresIn:'1d'});
        return res.status(200).json({ success: true, message: "Login successful",token });

    } catch (error) {
        return res.status(500).json({success: false, message:`server error`, error});
    }
}
//when user forget password
export async function forgotPass(req, res){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "abhishektripathi1112@gmail.com"  , // Your email address
            pass: "juyl rrei nlhd cllv", // Your email password or app-specific password
        }
    
    });
    
    const {email} = req.body
    try {
        const user = await Users.findOne({email})
        if (!user) {
            return res.status(404).json({success:false, message: `${email} not found`})
        }
        // Step 2: Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiry (e.g., 10 minutes from now)
        const otpExpires = Date.now() + 10 * 60 * 1000;

        // Step 3: Send the OTP to the user's email using Nodemailer
        const mailOptions = {
            from: 'abhishektripathi1112@gmail.com', // Sender address
            to: email,                    // Recipient's email
            subject: 'Your OTP for Password Reset',
            text: `Your OTP code is ${otp}. It expires in 10 minutes.`
        };
        console.log("data");
        
        const data=await transporter.sendMail(mailOptions);
        console.log(data);
        
        
        // Step 4: Save the OTP and expiration time in the user's record
        user.resetOTP = otp;
        user.expireOTP = otpExpires;
        await user.save()

        // Step 5: Respond with success
        return res.status(200).json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }

}

export async function verifyOtp(req, res) {
    const {email, otp} = req.body;
    const user = await Users.findOne({email});
    try {
        if (!user){

            return res.status(404).json({success:false, message: `${email} not found`})
         }
     
         if (user.resetOTP !== otp || Date.now() > expireOTP){
            return res.status(400).json({success:false, message:`Otp is invalid or expired `})
         }
     
         res.status(200).json({success:true, message:`OTP verified successfully`})
         
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export async function changePass(req, res) {
    const {email, newPassword} = req.body;
    const user = await Users.findOne({email});

    if (!user) {
        return res.status(404).json({ success: false, message: `${email} not found` });
    }

    try {
        user.password = newPassword;
        await user.save()
        return res.status(200).json({success:true, message:`Password changes successfully`})
    } catch (error) {
        return res.status(500).json({success:false, message:"Server Error",error:error})
    }


}

    