import { ObjectId } from 'bson';
import {
    MongoClient,
    Collection,
    Cursor,
    Db,
    DeleteWriteOpResultObject,
    InsertOneWriteOpResult,
    UpdateWriteOpResult,
	InsertWriteOpResult
} from 'mongodb';


export interface IWriter<T> {
	insertOne(item: T, options?:Object): Promise<boolean>;
	insertMany(items: T[], options?:Object):Promise<boolean>;
    updateOne(filter:any, updates:Object, options?:Object): Promise<boolean>;
    delete(filter:any): Promise<boolean>;
    set(filter: any, setOp: any) : Promise<boolean>;
    pull(filter: any, pullOp: any) : Promise<boolean>;
    push(filter: any, pushOp: any) : Promise<boolean>;
}

export interface IReader<T> {
    find(filter: any, options?: Object): Promise<ListResult<T>>;
	findOne(filter: any, options?: Object): Promise<GetResult<T>>;
	countDocuments(query:Object, options?:Object):Promise<number>;
}

export interface GetResult<T> {
    count: number;
    doc: T | null;
    error:any;
}

export interface ListResult<T> {
    count: number;
    docs: T[];
    error:any;
}

export interface MongoConfig {
    collectionName: string;
	url:string;
	dbName: string;
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

    async insertOne(item: T, opts:Object): Promise<boolean> {
		let client;
		const options = opts || {};

		try {
			client = await MongoClient.connect(this.url);

			const op: InsertOneWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.insertOne(item, options);
			
			client.close();
			return !!op.result.ok;

		} catch(err){
			return false;
		}
	}


	async insertMany(items: T[], opts?:Object): Promise<boolean> {
		let client;
		const options = opts || {};

		try {
			client = await MongoClient.connect(this.url);

			const op: InsertWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.insertMany(items, options);

			client.close();
			return !!op.result.ok;

		} catch (err) {
			return false;
		}
	}


    /**
     * Deletes one doc matching the filter
    */
    async delete(filter: any): Promise<boolean> {
		let client;

		try {
			client = await MongoClient.connect(this.url);
			
			const op: DeleteWriteOpResultObject = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.deleteOne(filter);
			
			client.close();
			return !!op.result.ok;

		} catch(err) {
			return false;
		}
    }

    

    addToSet = async(filter:any, setOp:any):Promise<boolean> => {
      return await this.updateOne(filter, {
        $addToSet:setOp
      })
	}
	
    /**
     * Retrieves one document matching the filter
    */
    findOne = async (filter: any, opts?:Object): Promise<GetResult<T>> => {
		let client; 
		const options = opts || {}

      	try{
			client = await MongoClient.connect(this.url);

			const cursor: Cursor = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.findOne(filter, options);

        const docArray = await cursor.toArray();
        const result =  {
            count:  await cursor.count(),
            doc: (docArray.length > 0) ? docArray.shift() : null,
            error:null
		}
		
		client.close();
		return result;

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
    find = async (filter: any, opts?: Object): Promise<ListResult<T>> => {
		let client;
		const options = opts || {}

		try{
		  const client = await MongoClient.connect(this.url);
		  
			const cursor: Cursor = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.find(filter, options);


        	const result = {
				count: await cursor.count(),
              	docs: await cursor.toArray(),
              	error: null
			}
			
			client.close()
			return result;

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
    updateOne = async (filter: any, updates:Object, opts?:Object): Promise<boolean> => {
		let client;
		const options = opts || {}

		try {
			const client = await MongoClient.connect(this.url);

			const op: UpdateWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.updateOne(filter, updates,options);

			client.close();
			return !!op.result.ok;
		} catch(err){
			return false;
		}
    }

    upsert = async (filter: any, upserts: Object): Promise<boolean> => {
		let client;

		try {
			const client = await MongoClient.connect(this.url);

			const op: UpdateWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.updateOne(filter, upserts,
        			{
          				upsert:true
        			}
				  )
				  
			client.close();
      		return !!op.result.ok;
    	} catch(err) {
			return false;
		}
	}

    set = (filter: any, setOp: any) : Promise<boolean> => {
      return this.updateOne(filter, {
        $set:setOp
      })
    };
    pull = (filter: any, pullOp: any) : Promise<boolean> => {
      return this.updateOne(filter, {
        $pull:pullOp
      })
    };
    push = (filter: any, pushOp: any) : Promise<boolean> => {
      return this.updateOne(filter, {
        $push:pushOp
      })
    };

	/** 
	 * count the number of documents matching the query.
	*/
	countDocuments = async (query:Object, opts?:Object):Promise<number> => {
		let client;
		const options = opts || {}
		try {
			const client = await MongoClient.connect(this.url);

			const count = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.countDocuments(query, options);
			client.close();

			return count;
		} catch(err){
			return 0;
		}
	}
    
}
