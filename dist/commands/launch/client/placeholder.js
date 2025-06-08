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

module.exports.subsitutePlaceholders = function(text,
    {
        version, classpath, loaderVersion, libDir, classpathSeparator,
        nativesDir = "natives", assetsDir, assetIndex, playerName = "OfflinePlayer",
        authUUID = "00000000-0000-0000-0000-000000000000", accessToken = "none",
        userType = "legacy", versionType, gameDir
    }) {

    return text
        .replaceAll("${launcher_name}", "BlockEnv")
        .replaceAll("${launcher_version}", version)
        .replaceAll("${classpath}", classpath)
        .replaceAll("${version_name}", loaderVersion)
        .replaceAll("${library_directory}", libDir)
        .replaceAll("${classpath_separator}", classpathSeparator)
        .replaceAll("${natives_directory}", nativesDir)
        .replaceAll("${assets_root}", assetsDir)
        .replaceAll("${assets_index_name}", assetIndex)
        .replaceAll("${auth_player_name}", playerName)
        .replaceAll("${auth_uuid}", authUUID)
        .replaceAll("${auth_access_token}", accessToken)
        .replaceAll("${user_type}", userType)
        .replaceAll("${version_type}", versionType)
        .replaceAll("${game_directory}", gameDir)
        .replaceAll("${clientid}", "")
        .replaceAll("${auth_xuid}", "0");
}