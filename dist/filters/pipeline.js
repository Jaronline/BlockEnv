module.exports = function(...filters) {
    return function(...args) {
        return filters.reduce((result, filter) => {
            if (typeof filter !== 'function') {
                throw new TypeError('Filter must be a function');
            }
            return result.filter(filter);
        }, args);
    };
}