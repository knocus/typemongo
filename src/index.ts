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

export interface TypeMongoResponse {
	ok: boolean;
	err?: Error | string | Object;
	data? : any;	
}

export interface IWriter<T> {
	insertOne(item: T, options?:Object): Promise<TypeMongoResponse>;
	insertMany(items: T[], options?:Object):Promise<TypeMongoResponse>;
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

	/**
	 * Operation for mongoDB insertOne. Inserts one document into collection 
	 * 
	 * @param item a model object to be saved as a document
	 * @param opts mongodb insertOne options (all supported) Refer to mongodb docs.
	 * 
	 * @return a typemongo response.
	 * 
	 * If the operation was successful, 
	 * returns {
	 *   ok: true
	 * }
	 * 
	 * If the operation was not successful,
	 * returns {
	 *   ok: false
	 *   err: Error("some error here")
	 * }
	 */
  async insertOne(item: T, opts?:Object): Promise<TypeMongoResponse> {
		let client;
		const options = opts || {};

		try {
			client = await MongoClient.connect(this.url);

			const op: InsertOneWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.insertOne(item, options);
			
			await client.close();
			return {
				ok: !!op.result.ok,
			}

		} catch(err) {
			return {
				ok: false,
				err
			}
		}
	}

	/**
	 * Operation for mongodb insertMany.
	 * Inserts multiple documents at once.
	 * 
	 * @param items a list of model objects to be saved as documents
	 * @param opts mongodb insertMany options (all are supported). Refer to mongodb docs 
	 * 
	 * @return a typemongo response
	 * 
	 * If successful
	 * returns {
	 * 		ok: true
	 * }
	 * 
	 * 
	 * If not successful
	 * returns {
	 *    ok:false,
	 * 		err: Error("some error here")
	 * }
	 */
	async insertMany(items: T[], opts?:Object): Promise<TypeMongoResponse> {
		let client;
		const options = opts || {};

		try {
			client = await MongoClient.connect(this.url);

			const op: InsertWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.insertMany(items, options);

			await client.close();
			return {
				ok: !!op.result.ok
			}
		} catch (err) {
			return {
				ok: false,
				err
			}
		}
	}


  /**
	* Operation for mongoDB deleteOne
	* Deletes one doc matching the filter
	* @param query a query to match the document to delete.
	* @param opts  options for deleteOne. refer to mongodb docs.
	* 
	* @returns a typemongo response
	* If successful returns {
  *   ok: true   
	*	}
	* 
	* If not successful returns {
  *    ok: false,
  *    err: Error("some error here")
	* }
  */
  async deleteOne(query: any, opts?: Object): Promise<TypeMongoResponse> {
		let client;
		const options = opts || {}
		try {
			client = await MongoClient.connect(this.url);
			
			const op: DeleteWriteOpResultObject = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.deleteOne(query, opts);
			
			await client.close();
			return {
				ok: !!op.result.ok
			}

		} catch(err) {
			return {
				ok: false,
				err
			}
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

		} 
		catch(err){	
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
