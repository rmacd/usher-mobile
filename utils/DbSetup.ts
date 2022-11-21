import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';

enablePromise(true);

export const getDBConnection = async () => {
    return openDatabase({name: 'usher-data.db', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
    await db.executeSql(`CREATE TABLE IF NOT EXISTS locations
                         (
                             timestamp DATE NOT NULL,
                             project   TEXT NOT NULL,
                             value     TEXT NOT NULL
                         );`);
};
