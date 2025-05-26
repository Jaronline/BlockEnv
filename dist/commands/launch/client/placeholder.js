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