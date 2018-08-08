import { ObjectId } from 'bson';
import {
    MongoClient,
    Collection,
    Cursor,
    Db,
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult,
    UpdateWriteOpResult
} from 'mongodb';




export interface IWriter<T> {
    create(item: T): Promise<boolean>;
    update(id: string, item: T): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}

export interface IReader<T> {
    list(item: T): Promise<ListResult>;
    get(id: string): Promise<GetResult>;
}

export interface GetResult {
    count: number,
    doc: any
}

export interface ListResult {
    count: number,
    docs: any[]
}

export interface MongoService {
    db: Function
}

export abstract class MongoRepository<T> implements IWriter<T>, IReader<T> {
    public collection: any;

    constructor(collectionName: string, mongo:MongoService) {
        this.setCollection(collectionName, mongo);
    }

    setCollection = async(collectionName: string, mongo:MongoService) => {
        const db = await mongo.db();
        this.collection = await db.collection(collectionName);
    }
    /** 
     * Adds a doc to the collection
    */
    async create(item: T): Promise<boolean> {
        const op: InsertOneWriteOpResult = await this.collection.insertOne(item);
        return !!op.result.ok;
    }

    /** 
     * Adds many docs to the collection
    */
    async createMany(items: T[]): Promise<boolean> {
        throw new Error("Not Implemented")
    }


    /** 
     * Deletes one doc matching the filter
    */
    async delete(filter: any): Promise<boolean> {
        const op: DeleteWriteOpResultObject = await this.collection.deleteOne(filter)
        return !!op.result.ok;
    }

    /** 
     * Deletes many docs mathing the filter
    */
    async deleteMany(ids: string[]): Promise<boolean> {
        throw new Error("Not Implemented")
    }

    /** 
     * Retrieves one document matching the filter
    */
    get = async (filter: any): Promise<GetResult> => {
        const cursor: Cursor = await this.collection.findOne(filter);
        const docArray = await cursor.toArray();
        return {
            count: await cursor.count(),
            doc: (docArray.length > 0) ? docArray.shift() : null
        }
    }

    /** 
     * Retrieves many documents matching the filter
    */
    list = async (filter: any): Promise<ListResult> => {
        const cursor: Cursor = await this.collection.find(filter);
        return {
            count: await cursor.count(),
            docs: await cursor.toArray()
        }
    }

    /** 
     * Updates one doc matching the filter with the given update
    */
    update = async (filter: any, update: T): Promise<boolean> => {
        const op: UpdateWriteOpResult = await this.collection.updateOne(filter, update);
        return !!op.result.ok;
    }
}