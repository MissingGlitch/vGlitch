const { InputDataError, ConflictDataError, EmbedCharRangeError } = require("./errors");
const { INPUT_DATA_ERRORS_SUBTYPES, CONFLICT_DATA_ERRORS_SUBTYPES, EMBED_CHAR_RANGE_ERRORS_SUBTYPES } = require("./errors");

/**
 * Valida que la cantidad de opciones esté dentro del rango permitido (2 a 20).
 * Lanza un error si la cantidad es inválida.
 * @param {string[]} optionList - Array de opciones extraídas del input.
 * @throws {InputDataError} Si la cantidad es menor a 2 o mayor a 20.
 */
function validateOptionListLength(optionList) {
	const optionListFormatted = optionList.reduce((acc, curr) => acc + ', ' + curr);
	const input = `> number of options: ${optionList.length}\n` + `> raw option list: ${optionListFormatted}`;

	if (optionList.length < 2) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.NOT_ENOUGH_OPTIONS(input));
	if (optionList.length > 20) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.MAX_OPTIONS_EXCEEDED(input));
}

/**
 * Valida que la cantidad de repeticiones esté dentro del rango permitido (1 a 20).
 * Lanza un error si la cantidad es inválida.
 * @param {number} repetitions Cantidad de repeticiones solicitadas.
 * @throws {InputDataError} Si la cantidad es menor a 1 o mayor a 20.
 */
function validateRepetitionsQuantity(repetitions) {
	const input = `> repetitions: ${repetitions}`;

	if (repetitions < 1) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.NULL_REPETITIONS(input));
	if (repetitions > 20) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.MAX_REPETITIONS_EXCEEDED(input));
}

/**
 * Verifica si un valor no es null ni undefined.
 * @param {*} value - Valor a comprobar.
 * @returns {boolean} True si el valor no es null ni undefined, false en caso contrario.
 */
function isDefined(value) {
	return value !== null && value !== undefined;
}

/**
 * Valida que no exista conflicto entre los títulos y repeticiones provenientes de los inputs de texto y slash.
 * Lanza un error si ambos orígenes (text y slash) contienen título o repeticiones al mismo tiempo.
 * @param {{ title: string|string[]|null, content: string|null, repetitions: number|null }} dataFromText - Datos del input de texto.
 * @param {{ title: string|null, repetitions: number|null, separator: string|null }} dataFromSlash - Datos del input slash.
 * @throws {ConflictDataError} Si hay conflicto de títulos o repeticiones entre ambos orígenes.
 */
function validateNoInputConflict(dataFromText, dataFromSlash) {
	// Repetitions
	if (isDefined(dataFromText.repetitions) && isDefined(dataFromSlash.repetitions)) {
		const input = `> text repetitions: ${dataFromText.repetitions}\n` + `> slash repetitions: ${dataFromSlash.repetitions}`;
		throw new ConflictDataError(CONFLICT_DATA_ERRORS_SUBTYPES.TWO_REPETITIONS(input));
	};

	// Titles
	//// El dataFromText puede tener 0, 1 o 2 títulos. Cuando tiene 1 título es un string. Cuando tiene 2 títulos es un array.
	let input = "";
	let numberOfTitles = 0;
	if (typeof dataFromText.title === "string") {
		numberOfTitles++;
		input += `> text title: ${dataFromText.title}\n`;
	}
	if (dataFromSlash.title) {
		numberOfTitles++;
		input += `> slash title: ${dataFromSlash.title}\n`;
	}
	if (Array.isArray(dataFromText.title)) {
		numberOfTitles += 2;
		input += `> text title 1: ${dataFromText.title[0]}\n` + `> text title 2: ${dataFromText.title[1]}`;
	}

	if (numberOfTitles > 1) {
		input = input.trim();
		throw new ConflictDataError(CONFLICT_DATA_ERRORS_SUBTYPES.MULTIPLE_TITLES(input));
	}
}

/**
 * Valida que los datos principales cumplan con las restricciones de longitud y cantidad.
 * Lanza un error si alguno de los valores no cumple con los requisitos.
 * @param {string} title - Título de la selección.
 * @param {string[]} optionList - Array de opciones extraídas del input.
 * @param {number} repetitions - Cantidad de repeticiones solicitadas.
 * @throws {Error} Si el título o el contenido exceden el límite de caracteres, si el número de opciones no está en el rango permitido, o si las repeticiones no están en el rango permitido.
 */
function validateRangesAndLengths(title, optionList, repetitions) {
	// Repetitions: Quantity [1, 20].
	validateRepetitionsQuantity(repetitions);

	// Content: Array.length [2, 20].
	validateOptionListLength(optionList);

	// Title: Max Char Length 256.
	validateLengthForMessageHeader(title, optionList, repetitions);

	// Content: Max Char Lengths 4000 (single) y 1000 (multiple).
	validateLengthForMessageBody(optionList, repetitions);
}

/**
 * Valida que la longitud del encabezado del mensaje (título + opción más larga) no exceda el límite permitido por Discord.
 * Lanza un error si el encabezado supera los 256 caracteres.
 * @param {string} title - Título de la selección.
 * @param {string[]} optionList - Array de opciones extraídas del input.
 * @param {number} repetitions - Cantidad de repeticiones solicitadas.
 * @throws {EmbedCharRangeError} Si la longitud del encabezado excede los 256 caracteres.
 */
function validateLengthForMessageHeader(title, optionList, repetitions) {
	// validateRepetitionsQuantity(repetitions); // Como ya se validó antes, no es necesario volver a hacerlo aquí.
	// validateOptionListLength(optionList.length); // Como ya se validó antes, no es necesario volver a hacerlo aquí.
	let headerMessage, input;

	if (repetitions > 1) { // Multiple (Many Repetitions)
		headerMessage = `${title} (${repetitions}):`;
		if (headerMessage.length > 256) {
			input = `> title:\n${title}`;
			throw new EmbedCharRangeError(EMBED_CHAR_RANGE_ERRORS_SUBTYPES.TOTAL_HEADER_CHARS_EXCEEDED(input));
		}

	} else { // Single (One Repetition)
		const longestOption = optionList.reduce((a, b) => (a.length >= b.length ? a : b));
		headerMessage = `${title}: __${longestOption}__`;
		if (headerMessage.length > 256) {
			input = `> title: ${title}\n` + `> longest option: ${longestOption}`;
			throw new EmbedCharRangeError(EMBED_CHAR_RANGE_ERRORS_SUBTYPES.TOTAL_HEADER_CHARS_EXCEEDED(input));
		}
	}
}

/**
 * Valida que la longitud del cuerpo del mensaje (listado de opciones) no exceda los límites permitidos por Discord.
 * Lanza un error si el cuerpo supera los 4000 caracteres (para una sola repetición) o los 1000 caracteres (para múltiples repeticiones).
 * @param {string[]} optionList - Array de opciones extraídas del input.
 * @param {number} repetitions - Cantidad de repeticiones solicitadas.
 * @throws {EmbedCharRangeError} Si la longitud del cuerpo excede los límites permitidos.
 */
function validateLengthForMessageBody(optionList, repetitions) {
	// validateRepetitionsQuantity(repetitions); // Como ya se validó antes, no es necesario volver a hacerlo aquí.
	// validateOptionListLength(optionList.length); // Como ya se validó antes, no es necesario volver a hacerlo aquí.
	let bodyMessage;
	const longestOption = optionList.reduce((a, b) => (a.length >= b.length ? a : b));
	const optionlistWithChoicesFormattedForSingle = optionList.join(", ");
	const optionlistWithChoicesFormattedForMultiple = optionList.reduce((acc, curr) => acc + ', 00 ' + curr);

	if (repetitions > 1) { // Multiple (Many Repetitions)
		// Ej.:
		// -# Listado de resultados de las 3 opciones:
		// -# 00 Opción 1, 00 Opción 2, 00 Opción 3.
		bodyMessage = (
			`-# Listado de resultados de las ${optionList.length} opciones:\n` +
			`-# 00 ${optionlistWithChoicesFormattedForMultiple}.`
		);
		if (bodyMessage.length > 1000) {
			const input = `> option list:\n` + optionlistWithChoicesFormattedForSingle + ".";
			throw new EmbedCharRangeError(EMBED_CHAR_RANGE_ERRORS_SUBTYPES.TOTAL_BODY_CHARS_EXCEEDED_FOR_MULTIPLE(input));
		}

	} else { // Single (One Repetition)
		// Ej.:
		// -# Lista de Opciones (3): Opción 1, **Opción 2**, Opción 3.
		bodyMessage = `-# Lista de Opciones (${optionList.length}): ${optionlistWithChoicesFormattedForSingle.replace(longestOption, `**${longestOption}**`)}.`;
		if (bodyMessage.length > 4000) {
			const input = `> option list:\n` + optionlistWithChoicesFormattedForSingle + ".";
			throw new EmbedCharRangeError(EMBED_CHAR_RANGE_ERRORS_SUBTYPES.TOTAL_BODY_CHARS_EXCEEDED_FOR_SINGLE(input));
		}
	}
}

module.exports = { validateNoInputConflict, validateRangesAndLengths }