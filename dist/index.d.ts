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
    count: number;
    doc: any;
}
export interface ListResult {
    count: number;
    docs: any[];
}
export interface MongoService {
    db: Function;
}
export declare abstract class MongoRepository<T> implements IWriter<T>, IReader<T> {
    collection: any;
    constructor(collectionName: string, mongo: MongoService);
    setCollection: (collectionName: string, mongo: MongoService) => Promise<void>;
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
    get: (filter: any) => Promise<GetResult>;
    /**
     * Retrieves many documents matching the filter
    */
    list: (filter: any) => Promise<ListResult>;
    /**
     * Updates one doc matching the filter with the given update
    */
    update: (filter: any, update: T) => Promise<boolean>;
}
