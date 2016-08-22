const _ = require('lodash');

const STATUS = {
    PENDING: 0,
    RESOLVED: 1,
    REJECTED: 2
} 

const resolve = Symbol('resolve');
const reject = Symbol('reject');

module.exports = class Promise {
    constructor(exec) {
        if (!_.isFunction(exec)) {
            throw new TypeError('Promise constructor argument exec must be a function.');
        }

        this.status = STATUS.PENDING; 
        this.result = undefined;
        this.callbacks = [];

        try {
            exec(this[resolve], this[reject]);
        } catch(e) {
            this[reject](e);
        }
    }

    [resolve](value) {
        if (value instanceof Promise) {
            return value.then(this.resolve, this.reject);
        }
        process.nextTick(() => {
            if (this.status === STATUS.PENDING) {
                this.status = STATUS.RESOLVED;
                this.result = value;
                this.callbacks.forEach(cb => cb.onResolved(this.result));
            }
        });
    }

    [reject](reason) {
        process.nextTick(() => {
            if (this.status === STATUS.PENDING) {
                this.status = STATUS.REJECTED;
                this.result = reason;
                this.callbacks.forEach(cb => cb.onRejected(reason));
            }
        });
    }

    then(onResolved, onRejected) {
        onResolved = _.isFunction(onResolved) ? onResolved : v => v;
        onRejected = _.isFunction(onRejected) ? onRejected : r => { throw r };

        let self = this;

        if (self.status === STATUS.RESOLVED) {
            let newPromise = new Promise((resolve, reject) => {
                process.nextTick(() => {
                    try {
                        let value = onResolved(self.result);
                        
                    } catch (e) {

                    }
                })
            })            
        }
    }
};