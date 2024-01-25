#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from "chalk";

import { ServiceOptions } from 'roli-client';
import { createRoliClient, PoshChatbotApi } from "chatbot-service";

const roli = createRoliClient(new ServiceOptions(false, false));

// Get the API
const chatbotApi = roli.getEndpoint(PoshChatbotApi, "default");

await inquirer.prompt([{
    type: 'input',
    name: 'userName',
    message: "Login: "
}]).then(async ({userName}) => {
    
    console.log("Username: " + JSON.stringify(userName));
    
    // Call the API to get a Chatbot session
    const session = await chatbotApi.getSession(userName, "my-model");

    console.log(`You are speaking with a chatbot. Your session ID is ${session.sessionId}. Use /quit to exit chat.`);

    while (true) {
        await inquirer.prompt([{
            type: 'input',
            name: 'text',
            message: `${userName}: `
        }]).then(async ({text}) => {
            if (text === "/quit") {
                process.exit(0);
                return;
            } else {
                const response = await session.tell(text);
                const timestamp = chalk.grey(`[${new Date().toLocaleTimeString()}]`);
                const userName = chalk.whiteBright(`[chatbot]:`);
                const t = chalk.greenBright(response);    
                console.log(`${timestamp} ${userName} ${t}`);
            }
        })
    }
})