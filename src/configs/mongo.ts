import mongoose from "mongoose";

var uri = "mongodb://localhost:27017/2fa_node";

export const connectMongoose = async () => {
    mongoose.connect(uri).then(() => {
        console.log('Connected to MongoDB');
    });
}
