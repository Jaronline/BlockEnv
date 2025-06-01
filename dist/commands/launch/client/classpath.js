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
const { join, sep } = require("node:path");
const { existsFilter } = require("../../../filters");

module.exports.getClasspath = function({ versionJSON, libDir, separator }) {
    return versionJSON.libraries
        .filter(lib => !/:natives-/.test(lib.name))
        .map(lib => join(libDir, lib.downloads.artifact.path))
        .filter(existsFilter)
        .join(separator);
}