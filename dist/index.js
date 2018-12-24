"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const server_1 = require("./server");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = new database_1.Database();
        let server = new server_1.Server(db);
        try {
            //Prepare the database
            yield db.initialize('database.db');
            yield db.execute('CREATE TABLE IF NOT EXISTS Contact (Email TEXT UNIQUE NOT NULL, Date INT NOT NULL)');
            //Start listening
            yield server.listen();
        }
        catch (err) {
            console.error(err);
        }
        finally {
            yield db.release();
            console.log('Server has been stopped');
        }
    });
}
main();
