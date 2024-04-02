# Roli Real-Time Chat Example
Example real-time CLI-based chat application using the Roli real-time state manager. All messages are sent through a new service you create (named "Chat") hosted in the Roli cloud sandbox.

## Setup

Install Roli Tools
1. `npm install --global roli-tools`

Login to Roli

2. `roli login`

Choose "Continue as Guest" to remain anonymous if you prefer.

Download the example:

3. `npx tiged roliai/examples/chat chat`

Init the Roli service:

4. `cd chat/service && roli init-service`

Deploy the service:

5. `roli deploy-service`

Code-generate the client module:

6. `cd ../client && roli generate-client -d . chat`

## Run

Build the client:

7. `npm run build`

Open a new terminal window and start the chat console.

8. `npm run console`

Open a second terminal and start client 1. Enter any name when prompted.

9. `npm run chat`

Open a third terminal and start client 2. Enter another name when prompted.

10. `npm run chat`
