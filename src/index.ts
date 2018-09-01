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
  updateOne(query:any, updates:Object, options?:Object): Promise<TypeMongoResponse>;
  deleteOne(query:any, options?: Object): Promise<TypeMongoResponse>;
  set(query: any, setOp: any) : Promise<TypeMongoResponse>;
  pull(query: any, pullOp: any) : Promise<TypeMongoResponse>;
  push(query: any, pushOp: any) : Promise<TypeMongoResponse>;
}

export interface IReader<T> {
	find(query: any, options?: Object): Promise<TypeMongoResponse>;
	findOne(query: any, options?: Object): Promise<TypeMongoResponse>;
	countDocuments(query:Object, options?:Object):Promise<number>;
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
	 * Operation for mongoDB insertOne. 
	 * Inserts one document into collection 
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
	 * Deletes one doc matching the query
	 *
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

    
  /**
	 * [CAUTION] Under contruction
	 */
  addToSet = async(query:any, setOp:any):Promise<TypeMongoResponse> => {
      return await this.updateOne(query, {
        $addToSet:setOp
      })
	}
	
  /**
	 * Operation for mongodb findOne.
   * Retrieves one document matching the query.
	 * 
	 * @param query a query to match the document.
	 * @param opts  options to be passed. refer to mongodb docs.
	 * 
	 * @returns
  */
  findOne = async (query: any, opts?:Object): Promise<TypeMongoResponse> => {
		let client; 
		const options = opts || {}

    try{
			client = await MongoClient.connect(this.url);

			const cursor: Cursor = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.findOne(query, options);

        const docArray = await cursor.toArray();
        const data =  {
            count:  await cursor.count(),
            doc: (docArray.length > 0) ? docArray.shift() : null,
            error:null
				}
		
			await client.close();
			return {
				ok:true,
				data	
			}
		} 
		catch(err){	
			return {
					ok: false,
					err
      }
    }
  }

  /**
	 * Operation find for mongoDB. 
   * Retrieves many documents matching the query
	 * If successful, returns {
	 *   ok: true,
	 *   data:{
	 *      count: <somenumber>
	 *      docs: [... a list of docs...]
	 *   } 
	 * }
	 * 
	 * If not successful, returns {
	 *    ok: false,
	 *    err: Error("some error here")
	 * }
  */
  find = async (query: any, opts?: Object): Promise<TypeMongoResponse> => {
		let client;
		const options = opts || {}

		try{
		  const client = await MongoClient.connect(this.url);
		  
			const cursor: Cursor = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.find(query, options);


      const data = {
				count: await cursor.count(),
        docs: await cursor.toArray(),
        error: null
			}
			
			await client.close()
			return {
				ok: true,
				data
			}
    } catch(err) {
				return {
					ok: false,
					err
				}
      }
    }


  /**
	 * Operation updateOne 
	 * Updates one document matching the query
	 * 
	 * @param query a query to match documents to update
	 * @param updates objects corresponding to the updates to make
	 * @param opts options supported by mongodb. refer to mongodb docs.
	 */
  updateOne = async (query: any, updates:Object, opts?:Object): Promise<TypeMongoResponse> => {
		let client;
		const options = opts || {}

		try {
			const client = await MongoClient.connect(this.url);

			const op: UpdateWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.updateOne(query, updates,options);

			await client.close();
			return {
				ok: !!op.result.ok
			}
		} catch(err){
			return {
					ok: false,
					err
			}
		}
  }

  upsert = async (query: any, upserts: Object): Promise<boolean> => {
		let client;

		try {
			const client = await MongoClient.connect(this.url);

			const op: UpdateWriteOpResult = await client
				.db(this.dbName)
				.collection(this.collectionName)
				.updateOne(query, upserts,
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

  set = (query: any, setOp: any) : Promise<TypeMongoResponse> => {
      return this.updateOne(query, {
        $set:setOp
      })
  };
	
	pull = (query: any, pullOp: any) : Promise<TypeMongoResponse> => {
      return this.updateOne(query, {
        $pull:pullOp
      })
	};
		
  push = (query: any, pushOp: any) : Promise<TypeMongoResponse> => {
      return this.updateOne(query, {
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
