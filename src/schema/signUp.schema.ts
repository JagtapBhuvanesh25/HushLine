import {email, z} from "zod"

const usernameValidation = z
    .string()
    .min(6, "Username Must Be Atleast 6 Characters")
    .max(20, "Username Must Be Atmost 30 Characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username Cannot Have Special Characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid Email Address"}),
    password: z.string().min(6, {message: "Password Must Be Atleast 6 characters"}).max(25, {message: "Password Must Be Atmost 25 characters"})
})