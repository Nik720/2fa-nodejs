import { Request, Response } from "express";

const RegisterUser = async (req: Request, res: Response) => {
    console.log(req.body)
    res.status(201).json({
        status: "success", 
        message: "User created successfully"
    })
}


export default {
    RegisterUser
}