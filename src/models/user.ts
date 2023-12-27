import { Model, Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    enable2fa?: boolean;
    secrets2fa?: string;
}

interface IUserMethods {
    isPasswordMatch(): Boolean
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
    isEmailUsed(email: string): Boolean
}

const userSchema = new Schema<IUser>(
    {
        firstname: {
            type: String,
            required: true,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if(!validator.isEmail(value)) {
                    throw new Error("Invalid Email")
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            validate(value: string) {
                if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error("Password must contain at least one letter and one number");
                }
            }
        },
        enable2fa: {
            type: Boolean,
            default: false
        },
        secrets2fa: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// Check email is already in use or not
userSchema.static('isEmailUsed', async function(email, excludeUserId) {
    const user: IUser = await this.findOne({email});
    return !!user;
});

// // Save the encrypted password 
userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// // Check if password matches the user's password 

userSchema.method('isPasswordMatch', async function(password: string) {
    const user: IUser = this;
    return bcrypt.compare(password, user.password)
})


const User = model<IUser, UserModel>('User', userSchema);
export default User;