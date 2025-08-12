const path = require("node:path");
const logsFolder = path.join(__dirname, "..", "logs");
const { createLogger, format, transports } = require("winston");
const DiscordTransport = require("./loggerForDiscord");
const DISCORD_LOGS = process.env.DISCORD_LOGS;
const DISCORD_LOGS_ERRORS = process.env.DISCORD_LOGS_ERRORS;

const venezuelaTimeZone = () => {
	return new Date().toLocaleString("es-VE", {
		timeZone: "America/Caracas",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true
	}).replace(",", "").replace("m.", "").replace("p.", "pm").replace("a.", "am").concat("(VE)");
};

const logger = createLogger({
	format: format.combine(
		format.colorize(),
		format.timestamp({ format: venezuelaTimeZone }),
		format.printf( info => `> ${info.timestamp} [${info.level}]: ${info.message}` )
	),

	transports: [
		new transports.Console({
			format: format.combine(
				format.printf( info => `> ${info.timestamp} [${info.level}]: ${info.message}\n` )
			)
		}),
		new DiscordTransport({
			channelId: DISCORD_LOGS
		}),
		new DiscordTransport({
			channelId: DISCORD_LOGS_ERRORS,
			level: "error"
		}),
		new transports.File({
			filename: `${logsFolder}/general.log`,
			maxsize: 2000000,
			maxFiles: 5
		}),
		new transports.File({
			filename: `${logsFolder}/error.log`,
			maxsize: 2000000,
			maxFiles: 3,
			level: "error"
		}),
	]
});

logger.interaction = (interaction) => {
	const user = interaction.user.username;
	const command = interaction.isCommand() ? interaction.commandName : null;

	if (interaction.isChatInputCommand()) {
		logger.info(`<@${user}> usó el comando slash "${command}".\nComando Completo: ${interaction}`);
	}

	if (interaction.isUserContextMenuCommand()) {
		const target = interaction.targetUser.username;
		logger.info(`<@${user}> usó el comando de usuario "${command}" con <@${target}>.`);
	}

	if (interaction.isMessageContextMenuCommand()) {
		const target = interaction.targetMessage.author.username;
		logger.info(`<@${user}> usó el comando de mensaje "${command}" con un mensaje de <@${target}>.`);
	}

	// if (interaction.isButton()) {
	// 	// log para botones.
	// }

	// if (interaction.isAnySelectMenu()) {
	// 	// log para menús.
	// }

	// if (interaction.isModalSubmit()) {
	// 	// log para modals.
	// }

}

logger.textCommand = (message, command) => {
	const user = message.author.username;
	logger.info(`<@${user}> usó el comando de texto "${command}".\nComando Completo: ${message}`);
}

module.exports = logger;