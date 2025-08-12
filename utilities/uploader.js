const fs = require("node:fs");
const log = require("./logger");
const path = require("node:path");
const TOKEN = process.env.TOKEN;
const APP_ID = process.env.APP_ID;
const GUILD_ID = process.env.GUILD_ID;
const { REST, Routes } = require("discord.js");
const { serializeError } = require("./errorHandler");
const rest = new REST({ version: "10" }).setToken(TOKEN);

const applicationCommands = [];
const allCommandsFolderPath = path.join(__dirname, "..", "commands");
const commandTypesList = fs.readdirSync(allCommandsFolderPath);
for (const type of commandTypesList) {
	if (type !== "text") {
		const typePath = path.join(allCommandsFolderPath, type);
		const commandSubfoldersList = fs.readdirSync(typePath);
		for (const commandSubfolder of commandSubfoldersList) {
			const commandPath = path.join(typePath, commandSubfolder, "main.js");
			const command = require(commandPath);
			if ("data" in command && "execute" in command) {
				applicationCommands.push(command.data.toJSON())
			} else {
				log.warn(`WARNING: The ${folder} command at "${filePath}" is missing a required <data> or <execute> property.`);
			}
		}
	}
}

const uploadType = process.argv[2];
const uploadRoute = {
	dev: Routes.applicationGuildCommands(APP_ID, GUILD_ID),
	global: Routes.applicationCommands(APP_ID),
}

async function uploadCommands(type) {
	try {
		log.info(`Started uploading ${applicationCommands.length} application commands.`);
		const data = await rest.put(uploadRoute[type], { body: applicationCommands });
		log.info(`Successfully uploaded ${data.length} application commands.`);
	} catch (error) {
		log.error(serializeError(error));
	}
}

uploadCommands(uploadType);