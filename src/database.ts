import * as SQLite from 'sqlite3';

/**
 * Database for data persistance. Provides an async wrapper to
 * prevent blocking the main thread.
 */
export class Database {
    /**
     * The underlying SQLite database.
     */
    private _db?: SQLite.Database;

    /**
     * Initialize the database for use.
     * @param path The path of the datbase file.
     */
    public async initialize(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._db = new SQLite.Database(path, (err) => {
                if(err != null) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    /**
     * Execute a command against the database.
     * @param command The command to execute.
     * @param parameters The parameters of the command.
     */
    public async execute(command: string, parameters?: any[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(this._db == null){
                throw new Error('No database is connected');
            }

            this._db.serialize(() => {
                this._db!.run(command, parameters, (err) => {
                    if(err != null) {
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
     * Query data from the database.
     * @param query The query to run.
     * @param parameters The parameters of the command.
     */
    public async query(query: string, parameters?: any[]): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if(this._db == null){
                throw new Error('No database is connected');
            }

            this._db.all(query, parameters, (err, rows) => {
                if(err != null){
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * Release the database and discconect.
     */
    public async release(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(this._db == null){
                throw new Error('No database is connected');
            }

            this._db.close((err) => {
                if(err != null) {
                    reject(err);
                } 
                else {
                    resolve();
                }
            });
        });
    }
}