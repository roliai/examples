#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from "chalk";

import { ServiceOptions } from 'roli-client';
import { createRoliClient, ChatServer, ChatEntry, ChatEvent } from "chat-service";

const roli = createRoliClient(new ServiceOptions(false, false));

const chatServer = roli.getEndpoint(ChatServer, "Scott's No-kill Animal Shelter");

console.clear();
console.log(`Welcome to ${chalk.blueBright(chatServer.primaryKey)}!`)
console.log(chalk.grey(`The current server time is ${await chatServer.getTime()}.`));

const args = process.argv.slice(2);
if (args[0] === "--console") {
    
    const history = await chatServer.getHistory();
    if (history && history.length) {
        console.log("== Chat History ==");
        for (const chatEntry of history)
            outputChatEntry(chatEntry);
    }
    
    console.log("\nPress Ctrl+C to exit.\n");
    
    await roli.subscribeEvent(chatServer, ChatEvent, (chatEvent: ChatEvent) => {
        outputChatEntry(chatEvent.entry);
    });
} else {
    await inquirer.prompt([{
        type: 'input',
        name: 'userName',
        message: "Login: "
    }]).then(async ({userName}) => {
        console.log("Use /quit to exit chat.");
        while (true) {
            await inquirer.prompt([{
                type: 'input',
                name: 'text',
                message: `${userName}: `
            }]).then(async ({text}) => {
                if (text === "/quit") {
                    process.exit(0);
                    return;
                }
                await chatServer.say(userName, text);
            })
        }
    })
}

function outputChatEntry(entry: ChatEntry) {
    const timestamp = chalk.grey(`[${entry.timestamp.toLocaleTimeString()}]`);
    const userName = chalk.whiteBright(`[${entry.userName}]:`);
    const text = chalk.greenBright(entry.text);    
    console.log(`${timestamp} ${userName} ${text}`);
}