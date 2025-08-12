const { EmbedBuilder } = require("discord.js");
const { validateOperation } = require("./validators");
const { calculateCommandErrorHandler } = require("./errors");
const { evaluate } = require("../../instantiated_modules/mathjs");

async function calculate(messageOrInteraction, operation, inputTitle) {
	try {
		// Validations
		validateOperation(operation);

		// Execution
		const result = evaluate(operation);

		// Embed Construction for Response Message
		const title = inputTitle ?? "Cálculo";
		const user = messageOrInteraction.author || messageOrInteraction.user;
		const formattedOperation = operation.replaceAll("*", "×");
		let formattedResult = String(result);
		if (formattedResult.length > 1000) {
			formattedResult = formattedResult.slice(0, 1000) + "...";
		}

		const embed = new EmbedBuilder({
			description: `### __${title}:__\n### ${formattedOperation}\n## = ${formattedResult}`,
			footer: {
				text: `Cálculo solicitado por @${user.username}`,
				icon_url: user.displayAvatarURL()
			}
		});

		// End of Program: Send Result
		await messageOrInteraction.reply({ embeds: [embed] });

	} catch (error) {
		const errorEmbed = calculateCommandErrorHandler(error, operation);
		await messageOrInteraction.reply({ embeds: [errorEmbed] });
		throw error;
	}
}

module.exports = calculate;