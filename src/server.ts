import { Application } from "express";
import { Database } from "./database";

const Express = require('express');
const Path = require('path');
const Helmet = require('helmet');
const RateLimit = require('express-rate-limit');

/**
 * Server for listening for incoming web requests.
 */
export class Server {
    /**
     * The underlying express application.
     */
    private _app: Application;

    /**
     * Database for data persistancy
     */
    private _database: Database;

    /**
     * Create a new web server.
     * @param database The SQLite database
     */
    constructor(database: Database) {
        this._database = database;

        this._app = Express();
        this._app.use(Express.json());
        this._app.use(Helmet());
        this._app.use('/static', Express.static(__dirname + '/../static'));

        //Prevent from spam attacks
        let apiLimiter = RateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100
        });

        this._app.use('/subscribe', apiLimiter);
    }

    /**
     * Listen for incoming requests
     */
    public async listen(): Promise<void> {
        //Handle web requests
        this._app.get('/', async (req, res) => {
            res.sendFile(Path.resolve('static/main.html'));
        });

        //Handle requests to subscribe
        //It's expecting a object with an email property
        this._app.post('/subscribe', async (req, res) => {
            if (req.body.email == null) {
                res.sendStatus(400);
            }
            else {
                let email: string = req.body.email;

                if (!this._isValidEmail(email)) {
                    res.sendStatus(400);
                }
                //All good. Add the email
                else {
                    try {
                        await this._database.execute("INSERT INTO Contact VALUES(?, DATETIME('now'))", [email]);
                        res.sendStatus(200);
                    }
                    catch (err) {
                        console.error(err);
                        res.sendStatus(500);
                    }
                }
            }
        });

        /**
         * Request to get the robots.txt
         */
        this._app.get('/robots.txt', async (req, res) => {
            res.sendFile(Path.resolve('static/robots.txt'));
        });

        return new Promise<void>((resolve, reject) => {
            this._app.listen(3117, () => {
                console.log('Server is listening');
            });
        });
    }

    /**
     * Check if the string is a valid email.
     * @param str The string to test.
     * @returns True if the string is an email.
     */
    private _isValidEmail(str: string): boolean {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);
    }
}