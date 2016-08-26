'use strict';

let nextTick;
if (process && process.nextTick) {
    nextTick = process.nextTick;
} else {
    nextTick = setTimeout;
}

const STATUS = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
};

const _status = Symbol('status');
const _result = Symbol('result');
const _callbacks = Symbol('callbacks');

class Promise {
    constructor(exec) {
        let self = this;

        if (!(typeof (exec) === 'function')) {
            throw new TypeError('Promise constructor argument exec must be a function.');
        }
        if (!(self instanceof Promise)) {
            return new Promise(exec);
        }

        self[_status] = STATUS.PENDING; 
        self[_result] = undefined;
        self[_callbacks] = [];

        function resolve(value) {
            if (value instanceof Promise) {
                return value.then(resolve, reject);
            }
            nextTick(() => {
                if (self[_status] === STATUS.PENDING) {
                    self[_status] = STATUS.RESOLVED;
                    self[_result] = value;
                    self[_callbacks].map(cb => cb.onResolved(self[_result]));
                }
            });
        }

        function reject(reason) {
            nextTick(() => {
                if (self[_status] === STATUS.PENDING) {
                    self[_status] = STATUS.REJECTED;
                    self[_result] = reason;
                    self[_callbacks].map(cb => cb.onRejected(self[_result]));
                }
            });
        }

        try {
            exec(resolve, reject);
        } catch(e) {
            reject(e);
        }
    }

    then(onResolved, onRejected) {
        onResolved = typeof (onResolved) === 'function' ? onResolved : v => v;
        onRejected = typeof (onRejected) === 'function' ? onRejected : r => { throw r };

        let childPromise, value, self = this;

        function solver(promise, result, resolve, reject) {
            let then, settled = false;

            if (promise === result) {
                return reject(new TypeError('Cycle Promises'));
            }

            if (result instanceof Promise) {
                if (result[_status] === STATUS.PENDING) {
                    result.then(v => solver(promise, v, resolve, reject), reject);
                } else {
                    result.then(resolve, reject);
                }
            } else if ((result !== null) && (typeof (result) === 'object' || typeof (result) === 'function')) {
                try {
                    then = result.then;
                    if (typeof (then) === 'function') {
                        then.call(result, s => {
                            if (settled) return;
                            settled = true;
                            return solver(promise, s, resolve, reject);
                        }, r => {
                            if (settled) return;
                            settled = true;
                            return reject(r);
                        });
                    } else {
                        return resolve(result);
                    }
                } catch (e) {
                    if (settled) return;
                    settled = true;
                    return reject(e);
                }
            } else {
                return resolve(result);
            }
        }

        function childExec(value, onDone, resolve, reject, childPromise) {
            try {
                value = onDone(value);
                solver(childPromise, value, resolve, reject);
            } catch(e) {
                reject(e);
            }
        }

        switch (self[_status]) {
            case STATUS.RESOLVED:
                childPromise = new Promise((resolve, reject) => {
                    nextTick(() => childExec(self[_result], onResolved, resolve, reject, childPromise));
                });
                break;
            case STATUS.REJECTED:
                childPromise = new Promise((resolve, reject) => {
                    nextTick(() => childExec(self[_result], onRejected, resolve, reject, childPromise));
                });
                break;
            case STATUS.PENDING:
                childPromise = new Promise((resolve, reject) => {
                    self[_callbacks].push({
                        onResolved: (value) => childExec(value, onResolved, resolve, reject, childPromise),
                        onRejected: (value) => childExec(value, onRejected, resolve, reject, childPromise)
                    });
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

    spread(cb, onRejected) {
        return this.then(values => cb(...values), onRejected);
    }

    all(promises) {
        return Promise.all(promises);
    }

    map(cb, onRejected) {
        return this.then(promises => Promise.map(promises, cb), onRejected);
    }

    static resolve(value) {
        return new Promise((resolve, reject) => resolve(value));
    }

    static reject(value) {
        return new Promise((resolve, reject) => reject(value));
    }

    static all(promises) {
        return new Promise((resolve, reject) => {
            let settledCount = 0;
            let itemNum = promises.length;
            let results = Array.from({length: itemNum});
            promises.map((promise, index) => {
                Promise.resolve(promise).then(result => {
                    settledCount++;
                    results[index] = result;
                    if (settledCount === itemNum) {
                        return resolve(results);
                    }
                }, reason => reject(reason));
            });
        });
    }

    static map(promises, cb) {
        return new Promise((resolve, reject) => {
            let settledCount = 0;
            let itemNum = promises.length;
            let results = Array.from({length: itemNum});
            promises.map((promise, index) => {
                Promise.resolve(promise).then(result => {
                    settledCount++;
                    results[index] = cb(result);
                    if (settledCount === itemNum) {
                        return resolve(results);
                    }
                }, reason => reject(reason));
            });
        });
    }

    static race(promises) {
        return new Promise((resolve, reject) => promises.find(resolve));
    }

    static try(fn) {
        return new Promise((resolve, reject) => fn);
    }

    static deferred() {
        let dfd = {};
        dfd.promise = new Promise((resolve, reject) => {
            dfd.resolve = resolve;
            dfd.reject = reject;
        });
        return dfd;
    }
};

if (module && 'exports' in module) {
    module.exports = Promise;
}
