# TypeMongo [Work in Progress] [Unstable]
A generic [MongoDB](https://www.mongodb.com) repository for [Typescript](https://www.typescriptlang.org).
#### Introduction
MongoDB business logic written solely with native driver can quickly pile up a lot boilerplate code. Most of it can be reused with [generics](https://www.typescriptlang.org/docs/handbook/generics.html) and developing a generic repository that gets inherited by specific repositories.

There are other alternatives like [Mongoose](www.mongoosejs.com), [Mongolia](https://github.com/masylum/mongolia) which tackle reducing the bolierplate with different approaches.

TypeMongo solves it with Repository Pattern.
```
import { MongoRepository } from 'typemongo'
class MyRepository extends MongoRepository {
    constructor(){
        super()
    }

    /*
        MY REPO SPECIFIC METHODS HERE
    */
}
```
