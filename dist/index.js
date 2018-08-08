"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var MongoRepository = /** @class */ (function () {
    function MongoRepository(collectionName, mongo) {
        var _this = this;
        this.collection = function () { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mongo.db()];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.collection(this.collectionName)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Retrieves one document matching the filter
        */
        this.get = function (filter) { return __awaiter(_this, void 0, void 0, function () {
            var collection, cursor, docArray, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        collection = _b.sent();
                        return [4 /*yield*/, collection.findOne(filter)];
                    case 2:
                        cursor = _b.sent();
                        return [4 /*yield*/, cursor.toArray()];
                    case 3:
                        docArray = _b.sent();
                        _a = {};
                        return [4 /*yield*/, cursor.count()];
                    case 4: return [2 /*return*/, (_a.count = _b.sent(),
                            _a.doc = (docArray.length > 0) ? docArray.shift() : null,
                            _a)];
                }
            });
        }); };
        /**
         * Retrieves many documents matching the filter
        */
        this.list = function (filter) { return __awaiter(_this, void 0, void 0, function () {
            var collection, cursor, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        collection = _b.sent();
                        return [4 /*yield*/, collection.find(filter)];
                    case 2:
                        cursor = _b.sent();
                        _a = {};
                        return [4 /*yield*/, cursor.count()];
                    case 3:
                        _a.count = _b.sent();
                        return [4 /*yield*/, cursor.toArray()];
                    case 4: return [2 /*return*/, (_a.docs = _b.sent(),
                            _a)];
                }
            });
        }); };
        /**
         * Updates one doc matching the filter with the given update
        */
        this.update = function (filter, update) { return __awaiter(_this, void 0, void 0, function () {
            var collection, op;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        collection = _a.sent();
                        return [4 /*yield*/, collection.updateOne(filter, update)];
                    case 2:
                        op = _a.sent();
                        return [2 /*return*/, !!op.result.ok];
                }
            });
        }); };
        this.collectionName = collectionName;
        this.mongo = mongo;
    }
    /**
     * Adds a doc to the collection
    */
    MongoRepository.prototype.create = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, op;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        collection = _a.sent();
                        return [4 /*yield*/, collection.insertOne(item)];
                    case 2:
                        op = _a.sent();
                        return [2 /*return*/, !!op.result.ok];
                }
            });
        });
    };
    /**
     * Adds many docs to the collection
    */
    MongoRepository.prototype.createMany = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Not Implemented");
            });
        });
    };
    /**
     * Deletes one doc matching the filter
    */
    MongoRepository.prototype.delete = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var collection, op;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.collection()];
                    case 1:
                        collection = _a.sent();
                        return [4 /*yield*/, collection.deleteOne(filter)];
                    case 2:
                        op = _a.sent();
                        return [2 /*return*/, !!op.result.ok];
                }
            });
        });
    };
    /**
     * Deletes many docs mathing the filter
    */
    MongoRepository.prototype.deleteMany = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Not Implemented");
            });
        });
    };
    return MongoRepository;
}());
exports.MongoRepository = MongoRepository;
