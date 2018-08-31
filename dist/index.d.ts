export interface IWriter<T> {
    insertOne(item: T, options?: Object): Promise<boolean>;
    insertMany(items: T[], options?: Object): Promise<boolean>;
    updateOne(filter: any, updates: Object, options?: Object): Promise<boolean>;
    delete(filter: any): Promise<boolean>;
    set(filter: any, setOp: any): Promise<boolean>;
    pull(filter: any, pullOp: any): Promise<boolean>;
    push(filter: any, pushOp: any): Promise<boolean>;
}
export interface IReader<T> {
    find(filter: any, options?: Object): Promise<ListResult<T>>;
    findOne(filter: any, options?: Object): Promise<GetResult<T>>;
    countDocuments(query: Object, options?: Object): Promise<number>;
}
export interface GetResult<T> {
    count: number;
    doc: T | null;
    error: any;
}
export interface ListResult<T> {
    count: number;
    docs: T[];
    error: any;
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
    insertOne(item: T, opts?: Object): Promise<boolean>;
    insertMany(items: T[], opts?: Object): Promise<boolean>;
    /**
    * Deletes one doc matching the filter
    */
    delete(filter: any): Promise<boolean>;
    addToSet: (filter: any, setOp: any) => Promise<boolean>;
    /**
    * Retrieves one document matching the filter
    */
    findOne: (filter: any, opts?: Object | undefined) => Promise<GetResult<T>>;
    /**
    * Retrieves many documents matching the filter
    */
    find: (filter: any, opts?: Object | undefined) => Promise<ListResult<T>>;
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
