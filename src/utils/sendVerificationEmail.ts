import {resend} from "@/lib/resend"
import VerificationEmail from "../../emails/verificationEmail"
import { apiResponse } from "@/utils/apiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<apiResponse> {
    try {
        const { data, error } = await resend.emails.send({
        from: '<onboarding@resend.dev>',
        to: email,
        subject: 'HUSHLINE Verification Code',
        react: VerificationEmail({username, verifyCode})
        });
        return {
            success: false,
            message: "Verification Email Sent Successfukky"
        }
    } catch (error) {
        console.error("Error Sending Verification Email", error)
        return {
            success: false,
            message: "Failed To Send Verification Email"
        }
    }
}