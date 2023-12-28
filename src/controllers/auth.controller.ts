import { Request, Response } from "express";
import User, { IUser } from "../models/user";


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
            data: user
        })
      } catch (error) {
        return res.status(500).json({
            status: "fail", 
            message: `Something wrong while login`
        })
      }
}


export default {
    RegisterUser,
    LoginUser
}