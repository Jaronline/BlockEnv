module.exports = function() {
    const seen = new Set();

    return function(value) {
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    };
}