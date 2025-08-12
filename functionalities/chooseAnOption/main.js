const { parseInput } = require("./regexes");
const { EmbedBuilder } = require("discord.js");
const { getOptionsFromText } = require("./others");
const { chooseCommandErrorHandler } = require("./errors");
const { random } = require("../../instantiated_modules/mathjs");
const { validateRangesAndLengths, validateNoInputConflict } = require("./validators");

/**
 * Ejecuta la lógica del comando "choose" para seleccionar aleatoriamente una opción de una lista y responder con un embed en Discord.
 * @param {import("discord.js").Message|import("discord.js").ChatInputCommandInteraction} messageOrInteraction Mensaje o interacción de Discord donde se ejecuta el comando.
 * @param {string} optionListFromInput Lista de opciones extraídas del input original del usuario.
 * @param {string} [titleFromSlash] Título personalizado definido desde la interfaz de comandos slash.
 * @param {number} [repetitionsFromSlash] Cantidad de repeticiones solicitadas desde la interfaz de comandos slash.
 * @param {string} [separatorFromSlash] Separador utilizado para dividir las opciones.
 * @returns {Promise<void>} No retorna nada, responde directamente en Discord.
 */

async function chooseAnOption(messageOrInteraction, optionListFromInput, titleFromSlash, repetitionsFromSlash, separatorFromSlash) {
	try {
		// Initial Validations
		const dataFromText = parseInput(optionListFromInput);
		const dataFromSlash = {title: titleFromSlash, repetitions: repetitionsFromSlash, separator: separatorFromSlash};
		validateNoInputConflict(dataFromText, dataFromSlash);

		// Data & Default Parameters
		const title = dataFromSlash.title || dataFromText.title || "Resultado";
		const optionList = getOptionsFromText(dataFromText.content, separatorFromSlash);
		const repetitions = dataFromSlash.repetitions ?? dataFromText.repetitions ?? 1;

		// Final Validations + Discord Chars Limits
		validateRangesAndLengths(title, optionList, repetitions);

		// Execution: Choosing an Option
		const resultsPerOptions = {}; // Cantidad de veces que salió cada opción de la lista
		optionList.forEach(option => resultsPerOptions[option] = 0);
		const resultsPerRepetitions = []; // Resultados de cada Repetición
		for (let i=0; i<repetitions; i++) {
			const randomIndex = random(optionList.length); // [0, ..., optionList.length - 1]
			const selectedOption = optionList[randomIndex];
			resultsPerRepetitions.push(selectedOption);
			resultsPerOptions[selectedOption]++;
		}

		// Embed Construction for Response Message
		const user = messageOrInteraction.author || messageOrInteraction.user;
		const embedData = {};
		if (repetitions > 1) {
			embedData.title = `${title} (${repetitions}):`;
			embedData.fields = [];
			resultsPerRepetitions.forEach((result, index) => {
				const n = index + 1; // Para que el índice comience desde 1
				const formattedIndex = n < 10 ? `0${n}` : n; // Formatear el índice para que tenga dos dígitos (Ej.: 01, 02, ..., 10, 11, ..., 20)
				const field = {
					name: "",
					value: `\`#${formattedIndex}\`: **${result}**`,
					inline: true
				}
				embedData.fields.push(field);
			});
			const summaryOfOptions = `${resultsPerOptions[optionList[0]]} ` + optionList.reduce((a, b) => `${a}, ${resultsPerOptions[b]} ${b}`);
			const summaryField = {
				name: "",
				value: `-# Listado de resultados de las ${optionList.length} opciones:\n` + `-# ${summaryOfOptions}.`,
				inline: false
			}
			embedData.fields.push(summaryField);
		} else {
			const result = resultsPerRepetitions[0];
			embedData.title = `${title}: __${result}__`;
			embedData.description = `-# Lista de Opciones (${optionList.length}): ${optionList.join(", ").replace(result, `**${result}**`)}.`;
		}
		embedData.footer = {
			text: `Selección solicitada por @${user.username}`,
			icon_url: user.displayAvatarURL()
		}
		const embed = new EmbedBuilder(embedData);

		// End of Program: Send Result
		await messageOrInteraction.reply({ embeds: [embed] });

	} catch (error) {
		const dataFromText = parseInput(optionListFromInput); // ! Está feo tener que construir este objeto otra vez, a lo mejor la solución más bonita sería que el mismo error que lanzan los validators tenga ya todos los datos (aunque eso signifique pasarle a los validators todos los datos de text e input).
		const dataFromSlash = {title: titleFromSlash, repetitions: repetitionsFromSlash, separator: separatorFromSlash};
		const optionList = getOptionsFromText(dataFromText.content, separatorFromSlash);

		const errorMessageEmbed = chooseCommandErrorHandler(error, dataFromText, dataFromSlash, optionList, optionListFromInput);
		await messageOrInteraction.reply({ embeds: [errorMessageEmbed] });
		throw error; // ! Está feo tener que volver a lanzar otro error. A lo mejor el mismo ErrorHandler debería ser el que envíe los embeds de respuesta y no directamente la funcionalidad.
	}
}

module.exports = chooseAnOption;