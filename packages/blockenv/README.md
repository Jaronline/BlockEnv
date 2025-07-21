<div align="center">

<img width="256" src="icon.png" alt="BlockEnv logo">

# BlockEnv

**Minecraft Java testing environment for modpacks.**

[![GitHub](https://img.shields.io/github/license/jaronline/blockenv)](https://github.com/jaronline/blockenv/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@jaronline/blockenv?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@jaronline/blockenv)

</div>

## About

BlockEnv is an environment manager for testing Minecraft modpacks. It locally installs and runs Minecraft clients and servers.

### Features

- Launching a (modded) Minecraft server locally.
- Launcing a (modded) Minecraft client that can join the server.
- Automatic installing of the (modded) Minecraft server.
- Automatic installing of the (modded) Minecraft client.
- Cleaning of all environments.

**Note:** to join the launched server as a client, you will first need to put the server into offline-mode. See [Server Configuration](#server-configuration) for more information.

## Installation

### Requirements

- NodeJS
- Node package manager (npm, yarn or pnpm)
- Java

### Command

To install BlockEnv, run the command below with your package manager of choice.

#### NPM

```bash
npm install @jaronline/blockenv
```

#### Yarn

```bash
yarn add @jaronline/blockenv
```

#### PNPM

```bash
pnpm add @jaronline/blockenv
```

## Server Configuration

### Offline-mode

To put the server in offline-mode, so that clients created by BlockEnv can join the server, you will need to set `online-mode` to `false` in `server.properties`.

```properties
# ...
online-mode=false
# ...
```
