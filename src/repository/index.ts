import { getCollection } from "../configs/mongo"


export const insert = async(collection: string, doc: object) => {
    const dbCollection = await getCollection(collection);
    const result = dbCollection.insertOne(doc);
    return result;
}

export const findOne = async(collection: string, query: object) => {
    const dbCollection = await getCollection(collection);
    const result = dbCollection.find(query);
    return result;
}