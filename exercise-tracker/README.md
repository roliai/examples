# Roli

## Exercise Tracker Demo App

This demo is an example full-stack SaaS app that allows users to track the exercises they do in a shared real-time list.

## Building

This project uses the pnpm package manager and the Vite build system and requires NPM v16.4 and above. We recommend using NVM (https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) for npm installation management.

## Install Roli tools
```shell
npm install -g roli-tools
```

If you get an error while installing and you're on MacOS, follow this guide to configure NPM to install globally without needing `sudo`: https://digitalzoomstudio.net/2023/10/install-npm-packages-globally-on-mac-without-sudo/

## Install pnpm
```shell
npm install -g pnpm
```
See the note above if you get an error while installing and you're on MacOS.

## Set the Roli connection config
```shell
roli set-connection-info admin=https://admin.roli.app api=https://api.roli.app --enterprise
```

## Login to Roli
```shell
roli login
```

## Init the Roli service
```shell
roli init-service exercise-tracker -d ./service
```

## Deploy the service
```shell
roli deploy-service -d ./service
```

## Generate the service client package
```shell
roli generate-client -d .
```
Answer `pnpm` (the default) when it asks.

## Run the project in development mode using Vite
```shell
npm run dev
```

## Run the project using an optimized production build
```shell
npm run preview
```

## Build the project for static hosting like Vercel etc.
```shell
npm run build
```

The `./dist` directory will contain the compiled client code.
