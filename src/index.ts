import { Database } from './database';
import { Server } from './server';

require('dotenv').config();

async function main() {
    let db: Database = new Database();
    let server: Server = new Server(db);

    try {
        //Prepare the database
        await db.initialize('database.db');
        await db.execute('CREATE TABLE IF NOT EXISTS Contact (Email TEXT UNIQUE NOT NULL, Date INT NOT NULL)');

        //Start listening
        await server.listen();
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await db.release();
        console.log('Server has been stopped')
    }
}

main();









