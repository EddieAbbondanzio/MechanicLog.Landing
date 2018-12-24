"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const SQLite = __importStar(require("sqlite3"));
/**
 * Database for data persistance. Provides an async wrapper to
 * prevent blocking the main thread.
 */
class Database {
    /**
     * Initialize the database for use.
     * @param path The path of the datbase file.
     */
    initialize(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this._db = new SQLite.Database(path, (err) => {
                    if (err != null) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    /**
     * Execute a command against the database.
     * @param command The command to execute.
     * @param parameters The parameters of the command.
     */
    execute(command, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this._db == null) {
                    throw new Error('No database is connected');
                }
                this._db.serialize(() => {
                    this._db.run(command, parameters, (err) => {
                        if (err != null) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            });
        });
    }
    /**
     * Query data from the database.
     * @param query The query to run.
     * @param parameters The parameters of the command.
     */
    query(query, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this._db == null) {
                    throw new Error('No database is connected');
                }
                this._db.all(query, parameters, (err, rows) => {
                    if (err != null) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        });
    }
    /**
     * Release the database and discconect.
     */
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this._db == null) {
                    throw new Error('No database is connected');
                }
                this._db.close((err) => {
                    if (err != null) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
}
exports.Database = Database;
