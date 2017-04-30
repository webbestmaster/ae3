/* global openDatabase */
/* eslint-disable no-underscore-dangle */

export default class DB {

    constructor(dbName = 'DB-default-name',
                version = '0.1',
                description = 'DB default description',
                size = 1024 * 1024) {
        const db = openDatabase(dbName, version, description, size);

        if (!db) {
            throw new Error('DATA BASE IS NOT CONNECTED!');
        }

        const dbMaster = this;

        dbMaster._db = null;

        dbMaster.setDb(db);
    }

    setDb(db) {
        const dbMaster = this;

        dbMaster._db = db;
        return dbMaster;
    }

    getDb() {
        return this._db;
    }

    /**
     *
     * @param {string} tableName - ex: 'my-first-table'
     * @param {string} fields - ex: 'val1 TEXT, val2 TEXT'
     * @returns {Promise} - will resolved or rejected
     */
    createTable(tableName, fields) {
        return new Promise((resolve, reject) =>
            this
                .getDb()
                .transaction(tx =>
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS ${tableName} (${fields})`,
                        [],
                        resolve,
                        reject
                    )
                )
        );
    }

    /**
     *
     * @param {string} tableName - ex: 'my-first-table'
     * @param {string} fieldsName - ex: 'val1, val2'
     * @param {array} fieldsValue - ex: ['value number one', 'value number two']
     * @returns {Promise} - will resolved or rejected
     */
    create(tableName, fieldsName, fieldsValue) {
        return new Promise((resolve, reject) =>
            this
                .getDb()
                .transaction(tx =>
                    tx.executeSql(
                        `INSERT INTO ${tableName} (${fieldsName}) VALUES (` + fieldsValue.map(() => '?') + ')',
                        fieldsValue,
                        resolve,
                        reject
                    )
                )
        );
    }

    /**
     *
     * @param {string} tableName - ex: 'my-first-table'
     * @param {string} selectorKey - ex: 'val1'
     * @param {string|*} selectorValue - ex: 'value number one'
     * @returns {Promise} - will resolved or rejected
     */
    read(tableName, selectorKey, selectorValue) {
        return new Promise((resolve, reject) =>
            this
                .getDb()
                .transaction(tx =>
                    tx.executeSql(
                        `SELECT * FROM ${tableName} WHERE ${selectorKey}=?`,
                        [selectorValue],
                        (trx, result) => resolve(result.rows),
                        reject
                    )
                )
        );
    }

    /**
     *
     * @param {string} tableName - ex: 'my-first-table'
     * @returns {Promise} - will resolved or rejected
     */
    readTable(tableName) {
        return new Promise((resolve, reject) =>
            this
                .getDb()
                .transaction(tx =>
                    tx.executeSql(
                        `SELECT * FROM ${tableName}`,
                        [],
                        (trx, result) => resolve(result.rows),
                        reject
                    )
                )
        );
    }

    update(tableName, fieldName, fieldValue, selectorKey, selectorValue) { // selectorValue optional????
        return new Promise((resolve, reject) =>
            this
                .getDb()
                .transaction(tx =>
                    tx.executeSql(
                        `UPDATE ${tableName} SET ${fieldName}=? WHERE ${selectorKey}=?`,
                        [fieldValue, selectorValue],
                        resolve,
                        reject
                    )
                )
        );
    }

    /**
     *
     * @param {string} tableName - ex: 'my-first-table'
     * @param {string} selectorKey - ex: 'val1'
     * @param {string|*} selectorValue - ex: 'value number one'
     * @returns {Promise} - will resolved or rejected
     */
    delete(tableName, selectorKey, selectorValue) {
        return new Promise((resolve, reject) =>
            this
                .getDb()
                .transaction(tx =>
                    tx.executeSql(
                        `DELETE FROM ${tableName} WHERE ${selectorKey}=?`,
                        [selectorValue],
                        resolve,
                        reject
                    )
                )
        );
    }

}
