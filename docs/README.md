# Configuration

To configure BlockEnv, create a `blockenv.config.json` file.

## baseDir

The base directory is the directory where the Minecraft clients and servers will be installed. To configure this option, write the following into your configuration file:

```json5
{
    // ...
    "baseDir": "<BASE_DIRECTORY_PATH>"
    // ...
}
```

## environments

In environments you can specify configurations for your client and server environments.

```json5
{
    // ...
    "environments": {
        "client": {
            "name": "Client Environment",
            "type": "client", // "client" or "server"
            "path": "client", // installation path
            "loader": {
                "name": "neoforge",
                "version": "21.1.173"
            },
            "playerName": "Developer"
        },
        "server": {
            "name": "Server Environment",
            "type": "server", // "client" or "server"
            "path": "server", // installation path
            "loader": {
                "name": "neoforge",
                "version": "21.1.173"
            }
        }
    }
    // ...
}
```

### Common properties

| Name   | Type                                  | Description                                                                               |
|--------|---------------------------------------|-------------------------------------------------------------------------------------------|
| name   | string                                | The name of your environment, used in logs.                                               |
| type   | [environment type](#environment-type) | The type of environment, can be either "client" or "server".                              |
| path   | string                                | The path to the environment installation. This path is resolved from [baseDir](#basedir). |
| loader | [loader](#loader)                     | The mod loader information for this environment.                                          |

### Client properties

| Name       | Type   | Description                                                                     |
|------------|--------|---------------------------------------------------------------------------------|
| playerName | string | The name of the player for the environment. This is used as Minecraft username. |

# Reference

## Objects

### Loader

| Name    | Type   | Description                    |
|---------|--------|--------------------------------|
| name    | string | The name of the mod loader.    |
| version | string | The version of the mod loader. |

## Enums

### Environment Type

| Name   | Value    |
|--------|----------|
| client | "client" |
| server | "server" |
