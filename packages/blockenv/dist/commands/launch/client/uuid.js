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

const { createHash } = require("crypto");

module.exports.generateUUID = function generateUUID(playerName) {
    const data = "OfflinePlayer:" + playerName;
    const hash = createHash("md5").update(data, "utf8").digest();
    hash[6] &= 0x0f; hash[6] |= 0x30; 
    hash[8] &= 0x3f; hash[8] |= 0x80;
    return [...hash].map((b, i) =>
    (b & 0xff).toString(16).padStart(2, "0") +
    ([3, 5, 7, 9].includes(i) ? "-" : "")
    ).join("").slice(0, 36);
}