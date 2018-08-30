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
    update(filter:any, item: T): Promise<boolean>;
    delete(filter:any): Promise<boolean>;
    set(filter: any, setOp: any) : Promise<boolean>;
    pull(filter: any, pullOp: any) : Promise<boolean>;
    push(filter: any, pushOp: any) : Promise<boolean>;
}

export interface IReader<T> {
    list(filter: any, skip: number, limit: number, projections?: any): Promise<ListResult<T>>;
    get(filter: any): Promise<GetResult<T>>;
}

export interface GetResult<T> {
    count: number,
    doc: T | null,
    error:any
}

export interface ListResult<T> {
    count: number,
    docs: T[],
    error:any
}

export interface MongoConfig {
    collectionName: string,
	url:string,
	dbName: string
}

export abstract class MongoRepository<T> implements IWriter<T>, IReader<T> {
	// collection for this repo
	private collectionName: string;
	// Mongo URL
	private url: string;
	// Name of the primary db
	private dbName: string;

    constructor(config: MongoConfig) {
        this.collectionName = config.collectionName;
		this.url = config.url;
		this.dbName = config.dbName;
    }

    
    /**
     * Adds a doc to the collection
    */
    async create(item: T): Promise<boolean> {
		let client = null;
		
		try {
			client = await MongoClient.connect(this.url);
			const db = client.db(this.dbName);

			const op: InsertOneWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.insertOne(item);
			
			client.close();

        	return !!op.result.ok;
		} catch(err){
			throw err
		}
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

    addToSet = async(filter:any, setOp:any):Promise<boolean> => {
      return await this.update(filter, {
        $addToSet:setOp
      })
    }
    /**
     * Retrieves one document matching the filter
    */
    get = async (filter: any, projections?: any): Promise<GetResult<T>> => {
      try{
        const collection = await this.collection();
        const cursor: Cursor = await collection.findOne(filter)
          .project(projections);

        const docArray = await cursor.toArray();
        return {
            count: await cursor.count(),
            doc: (docArray.length > 0) ? docArray.shift() : null,
            error:null
        }
      } catch(err){
          return {
            count:0,
            doc: null,
            error:err
          }
      }
    }

    /**
     * Retrieves many documents matching the filter
    */
    list = async (filter: any, skip:number, limit:number, projections?:any): Promise<ListResult<T>> => {
        try{
          const collection = await this.collection();
          const cursor: Cursor = await collection.find(filter)
            .skip(skip)
            .limit(limit)
            .project(projections);
            return {
              count: await cursor.count(),
              docs: await cursor.toArray(),
              error: null
            }
        } catch(err) {
            return {
              count: 0,
              docs: [],
              error:err
            }
        }
    }


    /**
     * Updates one doc matching the filter with the given update
    */
    update = async (filter: any, update: any): Promise<boolean> => {
        const collection = await this.collection();
        const op: UpdateWriteOpResult = await collection.updateOne(filter, update);
        return !!op.result.ok;
    }

    upsert = async (filter: any, item: any): Promise<boolean> => {
      const collection = await this.collection();
      const op: UpdateWriteOpResult = await collection.updateOne(filter, item,
        {
          upsert:true,
          safe:false
        }
      )
      return !!op.result.ok;
    }

    set = (filter: any, setOp: any) : Promise<boolean> => {
      return this.update(filter, {
        $set:setOp
      })
    };
    pull = (filter: any, pullOp: any) : Promise<boolean> => {
      return this.update(filter, {
        $pull:pullOp
      })
    };
    push = (filter: any, pushOp: any) : Promise<boolean> => {
      return this.update(filter, {
        $push:pushOp
      })
    };

    sort = async (filter: any, skip:number, limit:number, sort:any): Promise<ListResult<T>> => {
        try{
          const collection = await this.collection();
          const cursor: Cursor = await collection.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(limit);
            return {
              count: await cursor.count(),
              docs:await cursor.toArray(),
              error:null
            }
        } catch (err) {
          return {
            count:0,
            docs:[],
            error:err
          }
        }
    }
}
