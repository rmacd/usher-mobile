import {
    DatabaseParams,
    DEBUG,
    enablePromise,
    openDatabase,
    SQLError,
    SQLiteDatabase,
} from 'react-native-sqlite-storage';
import uuid from 'react-uuid';
import {DateTime, DurationUnit, Interval} from 'luxon';
import {request} from './Request';
import {BASE_API_URL} from '@env';

// luxon cheatsheet https://moment.github.io/luxon/demo/global.html

enablePromise(true);
DEBUG(false);

const DATABASE_NAME = 'usher-data.sqlite';
const LAST_UPLOAD_PROP = 'last_upload';
const UPLOAD_LOCK_PROP = 'upload_lock';
const EVENT_COUNT_ = 'event_count_';
const UPLOAD_LOCK_SEC = 15;

const dbParams: DatabaseParams = {
    name: DATABASE_NAME,
    readOnly: false,
    location: 'default',
};

export const getDBConnection = async () => {
    console.debug('Calling getDBConnection()');
    return openDatabase({...dbParams}, () => {
    }, (e) => {
        throw Error(`Error in getDBConnection ${e.code} - ${e.message}`);
    });
};

export const createTables = async (db: SQLiteDatabase) => {
    console.debug('Calling createTables()');

    // await db.executeSql(`DROP TABLE events;`);

    function throwError(s: string, e: SQLError) {
        console.warn(`Error in executing SQL ${s} ${e}`);
        throw e;
    }

    await db.executeSql(`CREATE TABLE IF NOT EXISTS events
                         (
                             uuid      TEXT NOT NULL,
                             timestamp DATE NOT NULL,
                             project   TEXT NOT NULL,
                             value     TEXT NOT NULL
                         );`).catch((e) => {
        throwError('creating events', e);
    });
    await db.executeSql(`CREATE TABLE IF NOT EXISTS global_permissions
                         (
                             permission TEXT UNIQUE NOT NULL,
                             value      BOOLEAN     NOT NULL
                         );`).catch((e) => {
        throwError('creating events', e);
    });
    // await db.executeSql(`DROP TABLE metadata;`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS metadata
                         (
                             property TEXT UNIQUE NOT NULL,
                             value    TEXT        NOT NULL
                         );`).catch((e) => {
        throwError('creating events', e);
    });

    deleteProperty(UPLOAD_LOCK_PROP);
};

export const dropDatabase = async () => {
    console.debug('Calling dropDatabase()');
    console.info('Deleting database');
    console.warn('function not implemented');
};

export const writeEvent = async (db: SQLiteDatabase, project: string, value: string) => {
    console.debug(`Calling writeEvent() with project ${project}`);
    await db.executeSql(`INSERT INTO events (uuid, timestamp, project, value)
                         VALUES ('${uuid()}', '${DateTime.now().toISO()}',
                                 '${project}', '${value}');`);
    getProperty(`${EVENT_COUNT_}${project}`)
        .then((res) => {
            if (res === undefined) {
                db.executeSql(`INSERT INTO metadata (property, value)
                               VALUES (?, ?);`, [`${EVENT_COUNT_}${project}`, 1]);
            } else {
                db.executeSql(`UPDATE metadata
                               SET value = value + 1
                               WHERE property = ?`, [`${EVENT_COUNT_}${project}`]);
            }
        });
};

export const deleteProject = async (projectId: string) => {
    console.debug('Calling deleteProject()');
    getDBConnection().then((db) => {
        db.executeSql(`DELETE
                       FROM events
                       WHERE project = ?;`, [projectId]);
    });
};

export const getEventsCount = async (projectId: string) => {
    console.debug(`Calling getEventsCount() with argument ${projectId}`);
    return getProperty(`${EVENT_COUNT_}${projectId}`);
};

export const getEvents = () => {
    console.debug('Calling getEvents()');
    return getDBConnection()
        .then((db) => {
            return db.transaction((tx) => {
                return tx.executeSql(`SELECT *
                                      FROM events
                                      LIMIT 500;`, [], (_tx, results) => {
                    console.debug(`Returned ${results.rows.length} events`);
                    return results.rows.raw();
                });
            }).catch((e) => {
                console.warn(`Error in get events transaction ${e}`);
                throw e;
            });
        });
};

export const getProperty = async (p: string) => {
    console.debug(`Calling getProperty() with argument ${p}`);
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
    console.debug(`Calling updateProperty() with arguments ${p}: ${v}`);
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
    console.debug(`Calling deleteProperty() with argument ${p}`);
    getProperty(p)
        .then((res) => {
            if (res !== undefined) {
                getDBConnection().then((db) => {
                    db.transaction((tx) => {
                        tx.executeSql(`DELETE
                                       FROM metadata
                                       WHERE property = ?;`, [p]);
                    }).catch((e) => {
                        console.info(`Error executing transaction ${e}`);
                        throw e;
                    });
                }).catch((e) => {
                    console.info(`Error getting connection ${e}`);
                    throw e;
                });
            }
        }).catch((e) => {
        console.info(`Error getting property ${e}`);
        throw e;
    });
};

export const deleteEvent = (id: string) => {
    console.debug('Calling deleteEvent()');
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
    console.debug('Calling doPushBatch()');
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
    console.debug('Calling doPush()');
    doPushBatch();
    getProperty(UPLOAD_LOCK_PROP).then((res) => {
        if (res !== undefined) {
            const diff = getDiff('seconds', DateTime.fromISO(res).toISO());
            if (diff > UPLOAD_LOCK_SEC) {
                console.info(`Lock was >${UPLOAD_LOCK_SEC} seconds ago, deleting ...`);
                deleteProperty(UPLOAD_LOCK_PROP).then(() => {
                    console.info('Deleted upload lock');
                });
            } else {
                getProperty(UPLOAD_LOCK_PROP).then((locked_since) => {
                    console.debug(`Upload currently in progress, locked since ${locked_since}`);
                });
                return {
                    then: function () {
                    },
                };
            }
        }
        upsertProperty(UPLOAD_LOCK_PROP, new Date().toISOString())
            .then(() => {
                doPushBatch();
            })
            .then(() => {
                deleteProperty(UPLOAD_LOCK_PROP).then(() => {
                    console.debug('Completed upload');
                });
            })
            .then(() => {
                upsertProperty(LAST_UPLOAD_PROP, DateTime.now().toString());
            });
    });
};

export const getDiff = (unit: DurationUnit, input: string) => {
    return Math.abs(Interval.fromDateTimes(DateTime.fromISO(input), DateTime.now()).length(unit));
};

export const triggerPushLocations = () => {
    console.debug('Calling triggerPushLocations()');
    getProperty(LAST_UPLOAD_PROP).then((res) => {
        if (res !== undefined) {
            const date = DateTime.fromISO(res);
            const diff = getDiff('seconds', date.toISO());
            console.log('diff', diff);
            if (diff > 60) {
                doPush();
            }
        } else {
            upsertProperty(LAST_UPLOAD_PROP, DateTime.now().toString());
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
