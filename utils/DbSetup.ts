import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';
import uuid from 'react-uuid';

enablePromise(true);

const LAST_UPLOAD_PROP = 'last_upload';

export const getDBConnection = async () => {
    return openDatabase({name: 'usher-data.db', location: 'default'});
};

export const createTables = async (db: SQLiteDatabase) => {
    await db.executeSql(`CREATE TABLE IF NOT EXISTS events
                         (
                             uuid      TEXT NOT NULL,
                             timestamp DATE NOT NULL,
                             project   TEXT NOT NULL,
                             value     TEXT NOT NULL
                         );`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS global_permissions
                         (
                             permission TEXT UNIQUE NOT NULL,
                             value      BOOLEAN NOT NULL
                         );`);
    await db.executeSql(`DROP TABLE metadata;`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS metadata (
        property TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL
    );`);
};

export const writeEvent = async (db: SQLiteDatabase, project: string, value: string) => {
    await db.executeSql(`INSERT INTO events (uuid, timestamp, project, value) VALUES (
                                                             '${uuid()}', '${new Date()}', 
                                                             '${project}', '${value}');`);
};

export const getLastUpload = async () => {
    getProperty(LAST_UPLOAD_PROP).then((v) => {
        return v;
    });
};

export const getProperty = async (p: string) => {
    await getDBConnection().then((db) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM metadata WHERE property='${p}';`,
                [], (_tx, results) => {
                    console.warn("res", results);
                    if (results.rows.length === 1) {
                        console.debug(`query property '${p}' returned value: ${results.rows.item(0).value}`);
                        return results.rows.item(0).value;
                    }
                    else {
                        console.warn(`query for property ${p} returned ${results.rows.length} results`);
                        return undefined;
                    }
                }
            );
        });
    });
};

export const upsertProperty = async (p: string, v: string) => {
    getProperty(p).then((res) => {
        if (res === undefined) {
            getDBConnection().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO metadata (property, value) VALUES (?, ?);`, [p, v]);
                });
            });
        }
        else {
            getDBConnection().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`UPDATE metadata SET value = ? WHERE property=?;`, [v, p]);
                });
            });
        }
    });
};

export const updateLastUpload = async (date?: Date) => {
    getLastUpload().then((res) => {
        console.debug(`Got result ${res}; updating ...`);
        upsertProperty(LAST_UPLOAD_PROP, new Date().toISOString());
    });
};

export const triggerPushLocations = () => {
    updateLastUpload();
    // getLastUpload().then((val) => {
    //     console.log(val);
    // });
    // getDBConnection().then((db) => {
    //     db.executeSql(`SELECT * FROM events`).then((res) => {
    //         for (const re of res) {
    //             console.log(re.rows.raw());
    //         }
    //     });
    // });
}
