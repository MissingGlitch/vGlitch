// Requeriments and Initializations
const fs = require("node:fs");
const path = require("node:path");
const log = require("./utilities/logger");
const handleInteraction = require("./utilities/interactionHandler");
const textCommandHandler = require("./utilities/textCommandHandler");
const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.TOKEN;
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

client.once(Events.ClientReady, () => {
	log.info(`¡Conectado! ${client.user.displayName} ya está en línea 🟢.`);
});

// Loading all Functionalities to the client
client.functionalities = new Collection();
const allFunctionalitiesFolderPath = path.join(__dirname, "functionalities");
const functionalityNameList = fs.readdirSync(allFunctionalitiesFolderPath);
for (const functionalityName of functionalityNameList) {
	const functionalityPath = path.join(allFunctionalitiesFolderPath, functionalityName, "main.js");
	const functionality = require(functionalityPath);
	client.functionalities.set(functionalityName, functionality);
}

// Loading all Commands to the client
client.commands = new Collection();
const allCommandsFolderPath = path.join(__dirname, "commands");
const commandTypesList = fs.readdirSync(allCommandsFolderPath);
for (const type of commandTypesList) {
	const typePath = path.join(allCommandsFolderPath, type);
	const commandSubfoldersList = fs.readdirSync(typePath);
	for (const commandSubfolder of commandSubfoldersList) {
		const commandPath = path.join(typePath, commandSubfolder, "main.js");
		const command = require(commandPath);
		if ("data" in command && "execute" in command) {
			client.commands.set(`[${type}] ${command.data.name}`, command)
		} else {
			log.warn(`El comando (${type}) <${command.data.name}> de la ubicación "${commandPath}" le falta una propiedad <data> o <execute> obligatoria.`);
		}
	}
}

// Loading all Message Components to the client
// // client.messageComponents = new Collection();

// Loading all Modals to the client
// // client.modals = new Collection();

// Interaction Detector
client.on(Events.InteractionCreate, detectInteraction);
async function detectInteraction(interaction) {
	// Application Commands: Slash/User/Message Commands
	if (interaction.isCommand()) {
		handleInteraction.applicationCommand(interaction);
	}

	// Message Components: Buttons/Menus
	// // if (interaction.isMessageComponent()) {
	// // 	handleInteraction.messageComponent(interaction);
	// // }

	// Autocomplete
	// // if (interaction.isAutocomplete()) {
	// // 	handleInteraction.autocomplete(interaction);
	// // }

	// Modals
	// // if (interaction.isModalSubmit()) {
	// // 	handleInteraction.modal(interaction);
	// // }
}

// Text Command Detector
const prefix = "v"; // Hasta no implementar el comando de configuración del bot, mantendré el prefijo fijo.
const allTextCommandsData = [...client.commands].filter(([key, value]) => key.startsWith("[text]")).map(([key, value]) => value.data);
client.on(Events.MessageCreate, detectTextCommand);
async function detectTextCommand(message) {
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix) && !message.content.startsWith(prefix.toUpperCase())) return;
	textCommandHandler(message, prefix, allTextCommandsData);
}

// Connection to Discord
client.login(TOKEN);

// Exporting the client for other modules to use
module.exports = client;