# Roli Real-Time Chat Example
Example real-time CLI-based chat application using the Roli real-time state manager. All messages are sent through a new service you create (named "Chat") hosted in the Roli cloud sandbox.

## Setup (1 minute)

Install Roli Tools
1. `npm install --global roli-tools`

Login to Roli

2. `roli login`

Choose "Continue as Guest" to remain anonymous if you prefer.

Checkout the repo:

3. `npx tiged rolijs/chat chat`

Init the Roli project:

4. `roli init`

Bring your Roli service online:

5. `roli up`

Install NPM modules

6. `npm install`

## Run

Open a new terminal and start the console:

7. `node index.mjs --console`

Open a second terminal and start client 1. Enter any name when prompted. (For instance "Linus")

8. `node index.mjs`

Open a third terminal and start client 2. Enter another name when prompted. (For instance "Torvalds")

9. `node index.mjs`
