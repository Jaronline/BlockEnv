function checkOS(rule, { osName, arch }) {
    if (!rule.os) {
        return true;
    }
    console.debug("Checking rule for OS:", osName, "and arch:", arch);
    return !rule.os || rule.os.name === osName;
}

function checkFeatures(rule) {
    return !rule.features;
}

module.exports = function(rules, options) {
    if (!rules || rules.length === 0) {
        return true;
    }
    return rules.some(rule => checkOS(rule, options) && checkFeatures(rule));
}