const _ = require('lodash');

const STATUS = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
};

const _status = Symbol('status');
const _result = Symbol('result');
const _callbacks = Symbol('callbacks');
const _resolve = Symbol('resolve');
const _reject = Symbol('reject');

module.exports = class Promise {
    constructor(exec) {
        if (!_.isFunction(exec)) {
            throw new TypeError('Promise constructor argument exec must be a function.');
        }

        let self = this;

        self[_status] = STATUS.PENDING; 
        self[_result] = undefined;
        self[_callbacks] = [];

        try {
            exec(self[_resolve], self[_reject]);
        } catch(e) {
            self[_reject](e);
        }
    }

    [_resolve](value) {
        let self = this;
        if (value instanceof Promise) {
            return value.then(self[_resolve], self[_reject]);
        }
        process.nextTick(() => {
            if (self[_status] === STATUS.PENDING) {
                self[_status] = STATUS.RESOLVED;
                self[_result] = value;
                self[_callbacks].forEach(cb => cb.onResolved(self[_result]));
            }
        });
    }

    [_reject](reason) {
        let self = this;
        process.nextTick(() => {
            if (self[_status] === STATUS.PENDING) {
                self[_status] = STATUS.REJECTED;
                self[_result] = reason;
                self[_callbacks].forEach(cb => cb.onRejected(self[_result]));
            }
        });
    }

    then(onResolved, onRejected) {
        onResolved = _.isFunction(onResolved) ? onResolved : v => v;
        onRejected = _.isFunction(onRejected) ? onRejected : r => { throw r };

        let childPromise, value, self = this;
        let resolve = self[_resolve];
        let reject = self[_reject];

        function solver() {
            
        }

        function childExec(value, resolve, reject) {
            try {
                if (_.isFunction(value)) {
                    value = value(self[_result]);
                }
                // TODO: resolver
            } catch(e) {
                reject(e);
            }
        }

        switch (self[_status]) {
            case STATUS.RESOLVED:
                childPromise = new Promise((resolve, reject) => {
                    process.nextTick(() => childExec(onResolved, resolve, reject));
                });
                break;
            case STATUS.REJECTED:
                childPromise = new Promise((resolve, reject) => {
                    process.nextTick(() => childExec(onRejected, resolve, reject));
                });
                break;
            case STATUS.PENDING:
                childPromise = new Promise((resolve, reject) => {
                    try {
                        self[_callbacks].push({
                            onResolved: (value) => childExec(onResolved(value), resolve, reject),
                            onRejected: (value) => childExec(onRejected(value), resolve, reject)
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
                break;
            default: 
                throw new TypeError('Invalid status value');
        }

        return childPromise;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
};
