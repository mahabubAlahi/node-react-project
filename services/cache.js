const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
    console.log('I am about to run a query');

    const key = Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    });
    return exec.apply(this, arguments);
}