const log = require("./logger");
const { EmbedBuilder } = require("discord.js");

function serializeError(errorObj) {
	console.error(errorObj);

	if (typeof errorObj !== "object" || errorObj === null) {
		return String(errorObj);
	}

	function serializer(key, value) {
		if (key === "stack" && typeof value === "string") {
			// Añadimos .trimEnd() aquí para eliminar el salto de línea final de la propiedad stack
			return value.trimEnd().replace(/\n/g, "__NEWLINE__").replace(/^(\s*)/gm, (match) => {
				return match.replace(/ /g, "__INDENT__");
			});
		}

		if (value instanceof Error) {
			const errorAsObject = {};
			errorAsObject.name = value.name;
			errorAsObject.message = value.message;
			for (const prop in value) {
				errorAsObject[prop] = value[prop];
			}
			return errorAsObject;
		}

		return value;
	}

	const errorSerialized = JSON.stringify(errorObj, serializer, 2)
		.replace(/__NEWLINE__/g, "\n").replace(/__INDENT__/g, " ");

	return errorSerialized;
}

function handleInteractionError(interaction, error) {
	const user = interaction.user.username;
	const command = interaction.isCommand() ? interaction.commandName : null;

	if (interaction.isChatInputCommand()) {
		log.error(
			`Ocurrió un error al ejecutar el comando slash "${command}".\n` +
			`<@${user}> fue quien ejecutó el comando.\n` +
			`El comando completo era: ${interaction}\n` +
			"Detalles del Error:\n" + serializeError(error)
		);
	}

	if (interaction.isUserContextMenuCommand()) {
		const target = interaction.targetUser.username;
		log.error(
			`Ocurrió un error al ejecutar el comando de usuario "${command}".\n` +
			`<@${user}> fue quien ejecutó el comando sobre <@${target}>.\n` +
			"Detalles del Error:\n" + serializeError(error)
		);
	}

	if (interaction.isMessageContextMenuCommand()) {
		const target = interaction.targetMessage.author.username;
		log.error(
			`Ocurrió un error al ejecutar el comando de mensaje "${command}".\n` +
			`<@${user}> fue quien ejecutó el comando sobre un mensaje de <@${target}>.\n` +
			"Detalles del Error:\n" + serializeError(error)
		);
	}

	// if (interaction.isButton()) {
	// 	// log de error para botones.
	// }

	// if (interaction.isAnySelectMenu()) {
	// 	// log de error para menús.
	// }

	// if (interaction.isModalSubmit()) {
	// 	// log de error para modals.
	// }
}


/**
 * Genera un embed de Discord para mostrar información de un error.
 * @param {string} title - Título o Nombre del error.
 * @param {string} description - Descripción breve del error.
 * @param {string} inputThatCausedTheError - Input que causó el error.
 * @returns {EmbedBuilder} Embed configurado para mostrar el error en Discord.
 */
function errorEmbedGenerator(title, description, inputThatCausedTheError) {
	const embed = new EmbedBuilder({
		author: { name: title },
		title: description,
		description: inputThatCausedTheError,
		color: 16711680
	});
	return embed;
}
// ! Hay que corregir esta función para que directamente solo haya que mandarle el título, la descripción y el input, y que la misma función se encargue de ponerlo bonito.
// ! Lo ideal sería que esta misma función pusiera el formato con los `` e iuncluso las ❌ del título.

// Función para "acortar inputs" cuando son muy largos para mostrarlos en el embed de error.
function shortenInput(originalInput) {
	const maxSize = 4000;
	if (originalInput.length > maxSize) {
		const shortenedInput = originalInput.slice(0, maxSize).concat("...");
		return shortenedInput;
	} else {
		return originalInput;
	}
}

module.exports = { serializeError, handleInteractionError, shortenInput, errorEmbedGenerator }