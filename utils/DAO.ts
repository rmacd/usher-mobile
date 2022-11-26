import {enablePromise, openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';
import uuid from 'react-uuid';
import {DateTime, DurationUnit, Interval} from 'luxon';
import {request} from './Request';
import {BASE_API_URL} from '@env';

// luxon cheatsheet https://moment.github.io/luxon/demo/global.html

enablePromise(true);

const LAST_UPLOAD_PROP = 'last_upload';
const UPLOAD_LOCK_PROP = 'upload_lock';
const UPLOAD_LOCK_SEC = 15;

export const getDBConnection = async () => {
    return openDatabase({name: 'usher-data.db', location: 'default'});
};

export const createTables = async (db: SQLiteDatabase) => {
    // await db.executeSql(`DROP TABLE events;`);

    await db.executeSql(`CREATE TABLE IF NOT EXISTS events
                         (
                             uuid TEXT      NOT NULL,
                             timestamp DATE NOT NULL,
                             project TEXT   NOT NULL,
                             value TEXT     NOT NULL
                         );`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS global_permissions
                         (
                             permission TEXT UNIQUE NOT NULL,
                             value      BOOLEAN     NOT NULL
                         );`);
    // await db.executeSql(`DROP TABLE metadata;`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS metadata
                         (
                             property TEXT UNIQUE NOT NULL,
                             value    TEXT        NOT NULL
                         );`);

    deleteProperty(UPLOAD_LOCK_PROP);
};

export const writeEvent = async (db: SQLiteDatabase, project: string, value: string) => {
    await db.executeSql(`INSERT INTO events (uuid, timestamp, project, value)
                         VALUES ('${uuid()}', '${DateTime.now().toISO()}',
                                 '${project}', '${value}');`);
};

export const getProperty = async (p: string) => {
    let value: string;
    return await getDBConnection()
        .then((db) => {
            return db.transaction((tx) => {
                tx.executeSql(`SELECT *
                               FROM metadata
                               WHERE property = ?;`,
                    [p], (_tx, results) => {
                        if (results.rows.length === 1) {
                            console.debug(`query property '${p}' returned value: ${results.rows.item(0).value}`);
                            value = results.rows.item(0).value;
                        } else {
                            console.info(`query for property ${p} returned ${results.rows.length} results`);
                        }
                    },
                );
            });
        })
        .then(() => {
            return value;
        });
};

export const upsertProperty = async (p: string, v: string) => {
    getProperty(p).then((res) => {
        if (res === undefined) {
            getDBConnection().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`INSERT INTO metadata (property, value)
                                   VALUES (?, ?);`, [p, v]);
                });
            });
        } else {
            getDBConnection().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`UPDATE metadata
                                   SET value = ?
                                   WHERE property = ?;`, [v, p]);
                });
            });
        }
    });
};

export const deleteProperty = async (p: string) => {
    getProperty(p).then((res) => {
        if (res !== undefined) {
            getDBConnection().then((db) => {
                db.transaction((tx) => {
                    tx.executeSql(`DELETE
                                   FROM metadata
                                   WHERE property = ?;`, [p]);
                });
            });
        }
    });
};

export const deleteEvent = (id: string) => {
    getDBConnection().then((db) => {
        db.transaction((tx) => {
            tx.executeSql(`DELETE
                           FROM events
                           WHERE uuid = ?;`, [id])
                .then((_res) => {
                    console.debug(`Deleted event ${id}`);
                });
        });
    });
};

// do not call this without a lock
export const doPushBatch = () => {
    getDBConnection().then((db) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT *
                           FROM events
                           LIMIT 100`, [], (cb, res) => {
                console.debug(`Got ${res.rows.length} results`);
                let data = [];
                for (let i = 0; i < res.rows.length; i++) {
                    data.push({
                        uuid: res.rows.item(i).uuid,
                        timestamp: res.rows.item(i).timestamp,
                        project: res.rows.item(i).project,
                        value: JSON.parse(res.rows.item(i).value),
                    });
                }
                request<string[]>(BASE_API_URL + '/upload', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                    .then((response) => {
                        for (const id of response) {
                            deleteEvent(id);
                        }
                    });
            });
        });
    });
};

export const doPush = () => {
    console.debug('doPush()');
    getProperty(UPLOAD_LOCK_PROP).then((res) => {
        if (res !== undefined) {
            const diff = getDiff('seconds', DateTime.fromISO(res).toISO());
            if (diff > UPLOAD_LOCK_SEC) {
                console.info(`Lock was >${UPLOAD_LOCK_SEC} seconds ago, deleting ...`);
                deleteProperty(UPLOAD_LOCK_PROP).then(() => {
                    console.info('Deleted upload lock');
                });
            }
            getProperty(UPLOAD_LOCK_PROP).then((locked_since) => {
                console.debug(`Upload currently in progress, locked since ${locked_since}`);
            });
            return {
                then: function () {
                },
            };
        }
        upsertProperty(UPLOAD_LOCK_PROP, new Date().toISOString())
            .then(() => {
                doPushBatch();
            })
            .then(() => {
                deleteProperty(UPLOAD_LOCK_PROP).then(() => {
                    console.debug('Completed upload');
                });
            });
    });
};

export const getDiff = (unit: DurationUnit, input: string) => {
    return Math.abs(Interval.fromDateTimes(DateTime.fromISO(input), DateTime.now()).length(unit));
};

export const triggerPushLocations = () => {
    getProperty(LAST_UPLOAD_PROP).then((res) => {
        if (res !== undefined) {
            const date = DateTime.fromISO(res);
            const diff = getDiff('seconds', date.toISO());
            console.log('diff', diff);
            if (diff > 60) {
                doPush();
            }
        }
    });
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
};
