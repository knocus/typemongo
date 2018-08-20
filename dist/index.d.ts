export interface IWriter<T> {
    create(item: T): Promise<boolean>;
    update(id: string, item: T): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
export interface IReader<T> {
    list(filter: any, skip: number, limit: number, projections?: any): Promise<ListResult>;
    get(id: string, projections?: any): Promise<GetResult>;
}
export interface GetResult {
    count: number;
    doc: any;
    error: any;
}
export interface ListResult {
    count: number;
    docs: any;
    error: any;
}
export interface MongoService {
    db: Function;
}
export declare abstract class MongoRepository<T> implements IWriter<T>, IReader<T> {
    collectionName: string;
    mongo: MongoService;
    constructor(collectionName: string, mongo: MongoService);
    collection: () => Promise<any>;
    addToSet: (filter: any, setOp: any) => Promise<boolean>;
    /**
     * Adds a doc to the collection
    */
    create(item: T): Promise<boolean>;
    /**
     * Adds many docs to the collection
    */
    createMany(items: T[]): Promise<boolean>;
    /**
     * Deletes one doc matching the filter
    */
    delete(filter: any): Promise<boolean>;
    /**
     * Deletes many docs mathing the filter
    */
    deleteMany(ids: string[]): Promise<boolean>;
    /**
     * Retrieves one document matching the filter
    */
    get: (filter: any, projections?: any) => Promise<GetResult>;
    /**
     * Retrieves many documents matching the filter with paging
    */
    list: (filter: any, skip: number, limit: number, projections?: any) => Promise<ListResult>;
    /**
     * Updates one doc matching the filter with the given update
    */
    update: (filter: any, update: any) => Promise<boolean>;
    /**
    * Helper function for $set operation
    */
    set: (filter: any, setOp: any) => Promise<boolean>;
    pull: (filter: any, pullOp: any) => Promise<boolean>;
    push: (filter: any, pushOp: any) => Promise<boolean>;
    sort: (filter: any, skip: number, limit: number, sort: any) => Promise<ListResult>;
}
