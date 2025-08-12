// Functions
const { EmbedBuilder } = require("discord.js");

const { rollDice } = require("./dice");
const { formatDiceResults } = require("./stylers");
const { validateDiceNotation, validateAllInitialInputData, validateFinalInputData, validateEmbedCharAmount } = require("./validators");

const { getRepetitions, getParametersFromText, applyAdvantageType, getComplement } = require("./others");
const { evaluate } = require("../../instantiated_modules/mathjs");
const { rollCommandErrorHanlder } = require("./errors");
const { repetitionNotation, diceDetector, rollCommandRegex } = require("./regexes");

// Roll Function
module.exports = {
	async roll(messageOrInteraction, rollFromInput, advantageTypeFromSlash, titleFromSlash, repetitionsFromSlash, charName) {
		try {
			// Initial Data & Initial Validations
			validateDiceNotation(rollFromInput);
			let diceNotationFromInput = rollFromInput.match(rollCommandRegex)[0].trim();

			const dataFromSlash = {};
			dataFromSlash.title = titleFromSlash;
			dataFromSlash.repetitions = repetitionsFromSlash;
			dataFromSlash.advantageType = advantageTypeFromSlash;

			const dataFromText = {};
			const titleAndParametersFromText = rollFromInput.replace(rollCommandRegex, "").trim();
			dataFromText.advantageType = getParametersFromText(diceNotationFromInput, titleAndParametersFromText);
			dataFromText.title = titleAndParametersFromText.replace(dataFromText.advantageType, "").trim();
			dataFromText.repetitions = getRepetitions(diceNotationFromInput);

			validateAllInitialInputData(dataFromSlash, dataFromText);

			// Final Data & Final Validation
			const title = dataFromSlash.title || dataFromText.title;
			const repetitions = dataFromSlash.repetitions ?? dataFromText.repetitions ?? 1;
			const advantageType = dataFromSlash.advantageType || dataFromText.advantageType;

			const warning = validateFinalInputData(diceNotationFromInput, title, repetitions, advantageType);

			// Execution
			const diceRolledResultsPerRepetitions = [];
			diceNotationFromInput = applyAdvantageType(advantageType, diceNotationFromInput);

			// Dice Rolls
			const diceRolled = diceNotationFromInput.match(diceDetector);
			for (let i=0; i<repetitions; i++) {
				const currentIteration = [];
				diceRolled.forEach(dice => {
					const result = rollDice(dice, diceNotationFromInput);
					currentIteration.push(result);
				});
				diceRolledResultsPerRepetitions.push(currentIteration);
			}

			// Replacing Notation Dice with Results (Obtained Dice)
			const resultsToBeEvaluated = [];
			diceRolledResultsPerRepetitions.forEach(repetitionsFromText => {
				let diceNotationForEvaluation = `${diceNotationFromInput.replace(repetitionNotation, "")}`;
				repetitionsFromText.forEach(result => {
					const dice = result.diceRolled;
					const value = result.total;
					diceNotationForEvaluation = diceNotationForEvaluation.replace(dice, value);
				});
				resultsToBeEvaluated.push(diceNotationForEvaluation);
			});

			// Application of Modifiers and Final Calculation of the Result
			const finalResults = [];
			resultsToBeEvaluated.forEach(result => { finalResults.push(evaluate(result)) });

			// Response Message
			let embed;
			const complement = getComplement(advantageType);
			const user = messageOrInteraction.author || messageOrInteraction.user;
			const responseMessage = formatDiceResults(diceNotationFromInput, diceRolledResultsPerRepetitions, finalResults);
			if (responseMessage.length > 1) {
				embed = new EmbedBuilder({
					author: { name: `${title || "Resultados"}${complement}:` },
					fields: [...responseMessage, {name:"", value:`Total: ${finalResults.reduce((x, y) => x+y)}`}, { name: "", value: "" }],
					footer: {
						text: `${charName ? `Tirada de ${charName}\n(hecha por @${user.username})` : `Tirada hecha por @${user.username}`}`,
						icon_url: user.displayAvatarURL()
					}
				});
			} else {
				embed = new EmbedBuilder({
					author: { name: `${title || "Resultado"}${complement}:` },
					fields: [...responseMessage, { name: "", value: "" }],
					footer: {
						text: `${charName ? `Tirada de ${charName}\n(hecha por @${user.username})` : `Tirada hecha por @${user.username}`}`,
						icon_url: user.displayAvatarURL()
					}
				});
			}

			// Overflow Embed Character Validation
			validateEmbedCharAmount(embed, rollFromInput, dataFromSlash, charName);

			// End of Program: Send Result
			await messageOrInteraction.reply({ embeds: [embed] });
			if (warning) {
				if (messageOrInteraction.type === 0) messageOrInteraction.reply(warning);
				else await messageOrInteraction.followUp({ content: warning, ephemeral: true });
			}

		} catch (error) {
			// ! corregir esto. Debe haber una forma de poder usar el dataFromSlash para los errores inesperados sin tener que crear el objeto aquí dentro.
			const dataFromSlash = {};
			dataFromSlash.title = titleFromSlash;
			dataFromSlash.repetitions = repetitionsFromSlash;
			dataFromSlash.advantageType = advantageTypeFromSlash;

			const errorMessageEmbed = rollCommandErrorHanlder(error, rollFromInput, dataFromSlash, charName); // ! De ser posible incluso llegar a tener esta función otra vez simplemente como rollCommandErrorHanlder(error) y listo sin más parámetros.
			await messageOrInteraction.reply({ embeds: [errorMessageEmbed] });
			throw error; // ! Está feo tener que volver a lanzar otro error. A lo mejor el mismo ErrorHandler debería ser el que envíe los embeds de respuesta y no directamente la funcionalidad.
		}
	}
}