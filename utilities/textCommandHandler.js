const fs = require("node:fs");
const log = require("./logger");

async function textCommandHandler(message, prefix, allTextCommandsData) {
	let commandIdentified = null;
	let keywordUsed = "";

	// for Keyword Calling (prefix + keyword)
	allTextCommandsData.forEach(cmdData => {
		const keyword = message.content.slice(prefix.length).split(" ")[0];
		if (cmdData.name === keyword || cmdData.aliases.includes(keyword)) {
			commandIdentified = cmdData.name;
			keywordUsed = keyword;
		}
	});

	// for Keywordless Calling (prefix + parameters with an specific pattern)
	if (!commandIdentified)	allTextCommandsData.forEach(cmdData => {
		const parameters = message.content.slice(prefix.length);
		cmdData.regexes.forEach(regex => {
			if (regex.test(parameters)) commandIdentified = cmdData.name;
		});
	});

	if (!commandIdentified) return;

	try {
		log.textCommand(message, commandIdentified);
		const command = message.client.commands.get(`[text] ${commandIdentified}`);
		if (!command) throw new ReferenceError(`No text command matching "${commandIdentified}" was found.`);
		const input = message.content.slice(prefix.length + keywordUsed.length).trim();
		await command.execute(message, input);
	} catch (error) {
		// handleInteractionError(message, error);
	}
}

// Habría que definir una mejor forma de obtener los prefijos de los comandos.
// Leer un archivo csv cada vez que se ejecuta un comando de texto no parece muy eficiente.
/*
function getTextCommandPrefix(guildId) {
	const defaultPrefix = "v";
	const csvFile = "./database/guilds-prefixes.csv";

	if (!fs.existsSync(csvFile)) {
		fs.writeFileSync(csvFile, "guildId,prefix\n", "utf-8");
		return defaultPrefix;
	}

	const csvContent = fs.readFileSync(csvFile, "utf-8");
	const lines = csvContent.trim().split("\n");

	for (let i = 1; i < lines.length; i++) {
		const [currentGuildId, prefix] = lines[i].split(",");
		if (currentGuildId === guildId) {
			return prefix;
		}
	}

	return defaultPrefix;
}
*/

module.exports = textCommandHandler;