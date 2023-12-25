import { MongoClient } from "mongodb";
var uri = "mongodb://localhost:27017/2fa_node";

let mongoClientdb: any;

export const connectMongo = async () => {
    try {
        const client = new MongoClient(uri);
        client.connect();
        mongoClientdb = client.db("2fa_node");
        console.log("Mongodb connected", mongoClientdb)
    } catch (error) {
        console.log("Mongodb connection failure: ", error)
    }
}

export const getMongoClientDB = async () => {
    if(!mongoClientdb) {
        await connectMongo();
    }
    return mongoClientdb;
}

export const getCollection = async(collectionName: string) => {
    return mongoClientdb.collection(collectionName)
}
