var util = {};

util.groupBy = function (arr, groupFn) {
    if (typeof groupFn !== 'function') {
        throw new Error("groupBy take a function as only parameter");
    }
    return arr.reduce((result, item) => {
        let key = groupFn(item);
        if (!result[key])
            result[key] = [];
        result[key].push(item);
        return result;
    }, {});
}

module.exports = util;