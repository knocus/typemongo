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
var mongodb_1 = require("mongodb");
var MongoRepository = /** @class */ (function () {
    function MongoRepository(config) {
        var _this = this;
        this.addToSet = function (filter, setOp) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.updateOne(filter, {
                            $addToSet: setOp
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        /**
         * Retrieves one document matching the filter
        */
        this.get = function (filter, opts) { return __awaiter(_this, void 0, void 0, function () {
            var client, options, cursor, docArray, result, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = opts || {};
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 2:
                        client = _b.sent();
                        return [4 /*yield*/, client
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .findOne(filter, options)];
                    case 3:
                        cursor = _b.sent();
                        return [4 /*yield*/, cursor.toArray()];
                    case 4:
                        docArray = _b.sent();
                        _a = {};
                        return [4 /*yield*/, cursor.count()];
                    case 5:
                        result = (_a.count = _b.sent(),
                            _a.doc = (docArray.length > 0) ? docArray.shift() : null,
                            _a.error = null,
                            _a);
                        client.close();
                        return [2 /*return*/, result];
                    case 6:
                        err_1 = _b.sent();
                        return [2 /*return*/, {
                                count: 0,
                                doc: null,
                                error: err_1
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Retrieves many documents matching the filter
        */
        this.list = function (filter, opts) { return __awaiter(_this, void 0, void 0, function () {
            var client, options, client_1, cursor, result, _a, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = opts || {};
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 2:
                        client_1 = _b.sent();
                        return [4 /*yield*/, client_1
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .find(filter, options)];
                    case 3:
                        cursor = _b.sent();
                        _a = {};
                        return [4 /*yield*/, cursor.count()];
                    case 4:
                        _a.count = _b.sent();
                        return [4 /*yield*/, cursor.toArray()];
                    case 5:
                        result = (_a.docs = _b.sent(),
                            _a.error = null,
                            _a);
                        client_1.close();
                        return [2 /*return*/, result];
                    case 6:
                        err_2 = _b.sent();
                        return [2 /*return*/, {
                                count: 0,
                                docs: [],
                                error: err_2
                            }];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Updates one doc matching the filter with the given update
        */
        this.updateOne = function (filter, updates, opts) { return __awaiter(_this, void 0, void 0, function () {
            var client, options, client_2, op, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = opts || {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 2:
                        client_2 = _a.sent();
                        return [4 /*yield*/, client_2
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .updateOne(filter, updates, options)];
                    case 3:
                        op = _a.sent();
                        client_2.close();
                        return [2 /*return*/, !!op.result.ok];
                    case 4:
                        err_3 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.upsert = function (filter, upserts) { return __awaiter(_this, void 0, void 0, function () {
            var client, client_3, op, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 1:
                        client_3 = _a.sent();
                        return [4 /*yield*/, client_3
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .updateOne(filter, upserts, {
                                upsert: true
                            })];
                    case 2:
                        op = _a.sent();
                        client_3.close();
                        return [2 /*return*/, !!op.result.ok];
                    case 3:
                        err_4 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.set = function (filter, setOp) {
            return _this.updateOne(filter, {
                $set: setOp
            });
        };
        this.pull = function (filter, pullOp) {
            return _this.updateOne(filter, {
                $pull: pullOp
            });
        };
        this.push = function (filter, pushOp) {
            return _this.updateOne(filter, {
                $push: pushOp
            });
        };
        this.collectionName = config.collectionName;
        this.url = config.url;
        this.dbName = config.dbName;
    }
    MongoRepository.prototype.insertOne = function (item, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var client, options, op, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = opts || {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 2:
                        client = _a.sent();
                        return [4 /*yield*/, client
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .insertOne(item, options)];
                    case 3:
                        op = _a.sent();
                        client.close();
                        return [2 /*return*/, !!op.result.ok];
                    case 4:
                        err_5 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MongoRepository.prototype.insertMany = function (items, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var client, options, op, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = opts || {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 2:
                        client = _a.sent();
                        return [4 /*yield*/, client
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .insertMany(items, options)];
                    case 3:
                        op = _a.sent();
                        client.close();
                        return [2 /*return*/, !!op.result.ok];
                    case 4:
                        err_6 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deletes one doc matching the filter
    */
    MongoRepository.prototype.delete = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var client, op, err_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(this.url)];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client
                                .db(this.dbName)
                                .collection(this.collectionName)
                                .deleteOne(filter)];
                    case 2:
                        op = _a.sent();
                        client.close();
                        return [2 /*return*/, !!op.result.ok];
                    case 3:
                        err_7 = _a.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MongoRepository;
}());
exports.MongoRepository = MongoRepository;
