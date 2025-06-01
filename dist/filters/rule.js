/**!
BlockEnv: Minecraft Java testing environment for modpacks.
Copyright (C) 2025 Jaronline

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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