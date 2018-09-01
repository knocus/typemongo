export interface TypeMongoResponse {
    ok: boolean;
    err?: Error | string | Object;
    data?: any;
}
export interface IWriter<T> {
    insertOne(item: T, options?: Object): Promise<TypeMongoResponse>;
    insertMany(items: T[], options?: Object): Promise<TypeMongoResponse>;
    updateOne(filter: any, updates: Object, options?: Object): Promise<boolean>;
    deleteOne(filter: any, options?: Object): Promise<TypeMongoResponse>;
    set(filter: any, setOp: any): Promise<boolean>;
    pull(filter: any, pullOp: any): Promise<boolean>;
    push(filter: any, pushOp: any): Promise<boolean>;
}
export interface IReader<T> {
    find(filter: any, options?: Object): Promise<TypeMongoResponse>;
    findOne(filter: any, options?: Object): Promise<TypeMongoResponse>;
    countDocuments(query: Object, options?: Object): Promise<number>;
}
export interface MongoConfig {
    collectionName: string;
    url: string;
    dbName: string;
}
export declare abstract class MongoRepository<T> implements IWriter<T>, IReader<T> {
    private collectionName;
    private url;
    private dbName;
    constructor(config: MongoConfig);
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
    insertOne(item: T, opts?: Object): Promise<TypeMongoResponse>;
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
    insertMany(items: T[], opts?: Object): Promise<TypeMongoResponse>;
    /**
       * Operation for mongoDB deleteOne
       * Deletes one doc matching the filter
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
    deleteOne(query: any, opts?: Object): Promise<TypeMongoResponse>;
    /**
       * [CAUTION] Under contruction
       */
    addToSet: (filter: any, setOp: any) => Promise<boolean>;
    /**
       * Operation for mongodb findOne.
     * Retrieves one document matching the query.
       *
       * @param query a query to match the document.
       * @param opts  options to be passed. refer to mongodb docs.
       *
       * @returns
    */
    findOne: (filter: any, opts?: Object | undefined) => Promise<TypeMongoResponse>;
    /**
       * Operation find for mongoDB.
     * Retrieves many documents matching the filter
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
    find: (query: any, opts?: Object | undefined) => Promise<TypeMongoResponse>;
    /**
    * Updates one doc matching the filter with the given update
    */
    updateOne: (filter: any, updates: Object, opts?: Object | undefined) => Promise<boolean>;
    upsert: (filter: any, upserts: Object) => Promise<boolean>;
    set: (filter: any, setOp: any) => Promise<boolean>;
    pull: (filter: any, pullOp: any) => Promise<boolean>;
    push: (filter: any, pushOp: any) => Promise<boolean>;
    /**
     * count the number of documents matching the query.
    */
    countDocuments: (query: Object, opts?: Object | undefined) => Promise<number>;
}
