export interface TypeMongoResponse {
    ok: boolean;
    err?: Error | string | Object;
    data?: any;
    cursor?: any;
}
export interface IWriter<T> {
    aggregate(pipeline: any[]): Promise<TypeMongoResponse>;
    insertOne(item: T, options?: Object): Promise<TypeMongoResponse>;
    insertMany(items: T[], options?: Object): Promise<TypeMongoResponse>;
    updateOne(query: any, updates: Object, options?: Object): Promise<TypeMongoResponse>;
    deleteOne(query: any, options?: Object): Promise<TypeMongoResponse>;
    set(query: any, setOp: any): Promise<TypeMongoResponse>;
    pull(query: any, pullOp: any): Promise<TypeMongoResponse>;
    push(query: any, pushOp: any): Promise<TypeMongoResponse>;
}
export interface IReader<T> {
    find(query: any, options?: Object): Promise<TypeMongoResponse>;
    findOne(query: any, options?: Object): Promise<TypeMongoResponse>;
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
     * Basic support for MongoDB aggregate.
     *
     * @param pipeline a list of aggregation operations
     *
     * @return a typemongo response.
     *
     * If the operation was successful,
     * returns {
     *   ok: true,
     *   data: ...somedata
     * }
     *
     * If the operation was not successful,
     * returns {
     *   ok: false
     *   err: Error("some error here")
     * }
    */
    aggregate(pipeline: any[]): Promise<TypeMongoResponse>;
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
    deleteOne(query: any, opts?: Object): Promise<TypeMongoResponse>;
    /**
     * [CAUTION] Under contruction
     */
    addToSet: (query: any, setOp: any) => Promise<TypeMongoResponse>;
    /**
     * Operation for mongodb findOne.
     * Retrieves one document matching the query.
     *
     * @param query a query to match the document.
     * @param opts  options to be passed. refer to mongodb docs.
     *
     * @returns
    */
    findOne: (query: any, opts?: Object | undefined) => Promise<TypeMongoResponse>;
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
    find: (query: any, opts?: Object | undefined) => Promise<TypeMongoResponse>;
    /**
     * Operation updateOne
     * Updates one document matching the query
     *
     * @param query a query to match documents to update
     * @param updates objects corresponding to the updates to make
     * @param opts options supported by mongodb. refer to mongodb docs.
     */
    updateOne: (query: any, updates: Object, opts?: Object | undefined) => Promise<TypeMongoResponse>;
    upsert: (query: any, upserts: Object) => Promise<boolean>;
    set: (query: any, setOp: any) => Promise<TypeMongoResponse>;
    pull: (query: any, pullOp: any) => Promise<TypeMongoResponse>;
    push: (query: any, pushOp: any) => Promise<TypeMongoResponse>;
    /**
     * count the number of documents matching the query.
    */
    countDocuments: (query: Object, opts?: Object | undefined) => Promise<number>;
}
