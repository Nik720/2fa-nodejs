import {Request, Response} from "express";
import User, {IUser} from "../models/user";
import * as crypto from "crypto";
import {encode} from "hi-base32";
import OTPAuth from "otpauth";
import QRCode from "qrcode";


const RegisterUser = async (req: Request, res: Response) => {
   
    try {
        const reqData: IUser = req.body;
        if(await User.isEmailUsed(req.body.email) ) {
            return res.status(404).json({
                status: "fail", 
                message: `User already exist with ${reqData.email}`
            })
        }
        await User.create(reqData)
        res.status(201).json({
            status: "success", 
            message: "User created successfully"
        });
    } catch (error: any) {
        res.status(404).json({
            status: "fail", 
            message: error.message
        })
    }
}

const LoginUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !(await User.isPasswordMatch(email, password))) {
            return res.status(401).json({
                status: "fail", 
                message: `Invalid email or password`
            })
        }
        res.status(200).json({
            status: "success", 
            data: {
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    enabled2fa: user.enable2fa
                }
            }
        })
      } catch (error) {
        return res.status(500).json({
            status: "fail", 
            message: `Something wrong while login`
        })
      }
}

const Enable2FA = async (req: Request, res: Response) => {
    const { email } = req.body;

    if(!await User.findOne({email})) {
        return res.status(404).json({
            status: "fail",
            message: "User does not exist"
        })
    }
    // Generate secret key for the user
    const base32_secret: string = generateBase32Secret();

    // Store secret key in User object
    await User.updateOne({email}, {secrets2fa: base32_secret});

    //Generate TOTP auth url
    let totp = new OTPAuth.TOTP({
        issuer: "codeninjainsights.com",
        label: "codeninjainsights",
        algorithm: "SHA1",
        digits: 6,
        secret: base32_secret
    });
    const otpauth_url: string = totp.toString();

    QRCode.toDataURL(otpauth_url, (err: Error | null | undefined, qrUrl: string) => {
        if(err) {
            return res.status(500).json({
                status: 'fail',
                message: "Error while generating QR Code"
            })
        }

        res.json({
            status: "success",
            data: {
                qrCodeUrl: qrUrl,
                secret: base32_secret
            }
        })
    })
}
const generateBase32Secret = () => {
    const buffer = crypto.randomBytes(15);
    return encode(buffer).replace(/=/g, "").substring(0, 24);
}

export default {
    RegisterUser,
    LoginUser,
    Enable2FA
}