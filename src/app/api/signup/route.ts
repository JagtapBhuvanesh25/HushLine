import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/user.model";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername= await userModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                    success: false,
                    message: "Username Is Already Taken"
                },
                {status: 400}
            )
        }

        const existingUserByEmail = await userModel.findOne({email})
        const verifyCode = Math.floor(100000 + (Math.random()*900000)).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User Already Exist With This Email"
                }, {status: 500})
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashedPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const verifyCodeExpiry = new Date()
            verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1)

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User Registered Successfully. Please Verify YOur Email"
        }, {status: 201})

    } catch (error) {
        console.error("Error Registering User", error)
        return Response.json({
            success: false,
            message: "Error Registering User"
        },{status: 500})
    }
}