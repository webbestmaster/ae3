/* global gapi */
import dbConst from './const.json';
import appConst from './../../app-const.json';
import DB from './../../lib/db';

let dbMaster = null;

export function initDb(name) {
    console.log(dbConst.type.initializeDb);

    return dispatch => {
        dispatch({
            type: dbConst.type.initializeDb,
            payload: {
                isInProgress: true,
                db: null
            }
        });

        const db = new DB(name, appConst.db.version);

        return Promise
            .all([
                db.createTable(
                    dbConst.table.messages.received,
                    dbConst.table.messages.fieldsWithType
                ),
                db.createTable(
                    dbConst.table.messages.sent,
                    dbConst.table.messages.fieldsWithType
                )
            ])
            .then(() => {
                dispatch({
                    type: dbConst.type.initializeDb,
                    payload: {
                        isInProgress: false,
                        db
                    }
                });

                dbMaster = db;

                return db;
            })
            .catch(evt => {
                console.error(evt);
                return evt;
            });
    };
}

export function getTables() {
    return dispatch => {
        dispatch({
            type: dbConst.type.getTables,
            payload: {
                isInProgress: true
            }
        });

        return Promise.all([
            dbMaster.readTable(dbConst.table.messages.received),
            dbMaster.readTable(dbConst.table.messages.sent)
        ]).then(tables => {
            let [received, sent] = tables;

            received = Array.from(received);
            sent = Array.from(sent);

            dispatch({
                type: dbConst.type.getTables,
                payload: {
                    isInProgress: false,
                    received,
                    sent
                }
            });

            return {received, sent};
        });
    };
}
