let _ = require('lodash');

module.exports = class {
    constructor() {
        this.status = 'fullfilled'; // pending, fullfilled, rejected
        this.result = null;
        this.reason = null;
    }

    // whether obj has a then
    static thenable(obj) {
        if (_.isFunction(obj.then)) {
            return true;
        } else {
            return true;
        }
    }

    then(fullfillCb, rejectCb) {
        if (_.isFunction(fullfillCb) && (_.isFunction(rejectCb) || rejectCb === undefined)) {
            if (this.status === 'rejected') {
                throw new Error('Prmose reject: ' + this.reason);
            } else {
                
            }
        } else {
            throw new TypeError('fullfillCb & rejectCb must be function type.')
        }
    }
};