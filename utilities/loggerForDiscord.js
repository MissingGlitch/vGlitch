const Transport = require("winston-transport");

class DiscordTransport extends Transport {
	constructor(options) {
		super(options);
		this.channelId = options.channelId;
		// this.client = options.client;
	}

	async log(info, callback) {
		try {
			const client = require("./../bot.js"); // Import the client from bot.js
			const channel = await client.channels.fetch(this.channelId);

			const initialBr = "‎";
			const timestamp = `-# ${info.timestamp}`;
			const level = formatLevel(info.level);
			const logBody = formatBody(level, info.message);

			const fullMessage = initialBr + "\n" + timestamp + "\n" + logBody;
			await channel.send(fullMessage);

			setImmediate(() => {
				this.emit("logged", info);
			});
			callback();

		} catch (error) {
			console.error("Error sending log to Discord channel:\n", error);
			callback();
		}
	}
}

function formatBody(level, message) {
	if (!level.includes("error")) return `\`\`\`ansi\n[${level}]: ${message}\n\`\`\``;

	const separatorKeyword = "Detalles del Error:";
	const dividingIndexForHeader = message.indexOf(separatorKeyword);
	const dividingIndexForErrorInfo = dividingIndexForHeader + separatorKeyword.length;
	const header = message.slice(0, dividingIndexForHeader);
	const errorInfo = message.slice(dividingIndexForErrorInfo).replaceAll("\\n```\\n", " ").replaceAll("\\n```", " ");

	const formattedBody = `\`\`\`ansi\n[${level}]: ${header}\n\`\`\`\n-# **${separatorKeyword}**\n\`\`\`json\n${errorInfo}\n\`\`\``;
	return formattedBody;
}

function formatLevel(level) {
	const originalStart = level.slice(0, 2);
	const originalEnd = level.slice(-3);
	const originalMiddle = level.slice(2, -3);

	const formattedStart = `${originalStart}1;`;
	const formattedEnd = `0;${originalEnd}`;

	const formattedLevel = `${formattedStart}${originalMiddle}${formattedEnd}`;
	return formattedLevel;
}

module.exports = DiscordTransport;