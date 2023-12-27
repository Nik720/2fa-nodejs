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


export default {
    RegisterUser
}