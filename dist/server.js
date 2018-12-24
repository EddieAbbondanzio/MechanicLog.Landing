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
const Express = require('express');
const Path = require('path');
const Helmet = require('helmet');
const RateLimit = require('express-rate-limit');
/**
 * Server for listening for incoming web requests.
 */
class Server {
    /**
     * Create a new web server.
     * @param database The SQLite database
     */
    constructor(database) {
        this._database = database;
        this._app = Express();
        this._app.use(Express.json());
        this._app.use(Helmet());
        this._app.use('/static', Express.static(__dirname + '/../static'));
        let apiLimiter = RateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        });
        this._app.use('/subscribe', apiLimiter);
    }
    /**
     * Listen for incoming requests
     */
    listen() {
        return __awaiter(this, void 0, void 0, function* () {
            //Handle web requests
            this._app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.sendFile(Path.resolve('static/main.html'));
            }));
            //Handle requests to subscribe
            //It's expecting a object with an email property
            this._app.post('/subscribe', (req, res) => __awaiter(this, void 0, void 0, function* () {
                if (req.body.email == null) {
                    res.sendStatus(400);
                }
                else {
                    let email = req.body.email;
                    if (!this._isValidEmail(email)) {
                        res.sendStatus(400);
                    }
                    //All good. Add the email
                    else {
                        try {
                            yield this._database.execute("INSERT INTO Contact VALUES(?, DATETIME('now'))", [email]);
                            res.sendStatus(200);
                        }
                        catch (err) {
                            console.error(err);
                            res.sendStatus(500);
                        }
                    }
                }
            }));
            return new Promise((resolve, reject) => {
                this._app.listen(80, () => {
                    console.log('Server is listening');
                });
            });
        });
    }
    /**
     * Check if the string is a valid email.
     * @param str The string to test.
     * @returns True if the string is an email.
     */
    _isValidEmail(str) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);
    }
}
exports.Server = Server;
