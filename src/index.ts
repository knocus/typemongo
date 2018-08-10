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
    list(filter: any, skip: number, limit: number): Promise<ListResult>;
    get(id: string): Promise<GetResult>;
}

export interface GetResult {
    count: number,
    doc: {
      toArray: Function
    }
}

export interface ListResult {
    count: number,
    docs: any
}

export interface MongoService {
    db: Function
}

export abstract class MongoRepository<T> implements IWriter<T>, IReader<T> {
    public collectionName:string;
    public mongo:MongoService;
    constructor(collectionName: string, mongo:MongoService) {
        this.collectionName = collectionName;
        this.mongo = mongo;
    }

    collection = async() => {
        const db = await this.mongo.db();
        return await db.collection(this.collectionName);
    }
    /**
     * Adds a doc to the collection
    */
    async create(item: T): Promise<boolean> {
        const collection = await this.collection();
        const op: InsertOneWriteOpResult = await collection.insertOne(item);
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
        const collection = await this.collection();
        const op: DeleteWriteOpResultObject = await collection.deleteOne(filter)
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
        const collection = await this.collection();
        const cursor: Cursor = await collection.findOne(filter);
        const docArray = await cursor.toArray();
        return {
            count: await cursor.count(),
            doc: (docArray.length > 0) ? docArray.shift() : null
        }
    }

    /**
     * Retrieves many documents matching the filter with paging
    */
    list = async (filter: any, skip:number, limit:number): Promise<ListResult> => {
        const collection = await this.collection();
        const cursor: Cursor = await collection.find(filter)
          .skip(skip)
          .limit(limit);
        return {
            count: await cursor.count(),
            docs: {
              toArray: await cursor.toArray()
            }
        }
    }

    /**
     * Updates one doc matching the filter with the given update
    */
    update = async (filter: any, update: T): Promise<boolean> => {
        const collection = await this.collection();
        const op: UpdateWriteOpResult = await collection.updateOne(filter, update);
        return !!op.result.ok;
    }
}
