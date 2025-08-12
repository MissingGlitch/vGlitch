const { rollCommandRegex, diceDetector, repetitionNotation } = require("./regexes");
const { evaluate } = require("../../instantiated_modules/mathjs");
const { isApplicable, embedCharCounter, diceDestructuring, getInputToDisplay } = require("./others");
const { DiceRangeError, InputDataError, ConflictDataError, EmbedCharRangeError } = require("./errors");
const { WARNING_TYPES, DICE_RANGE_ERRORS_SUBTYPES, INPUT_DATA_ERRORS_SUBTYPES, CONFLICT_DATA_ERRORS_SUBTYPES, EMBED_CHAR_RANGE_ERRORS_SUBTYPES } = require("./errors");

// Función para validar la cantidad de caracteres de los embeds usados en la funcionalidad (y asegurarse de que no superan los máximos permitidos).
function validateEmbedCharAmount (embed, rollFromInput, dataFromSlash, charName) {
	const input = getInputToDisplay(rollFromInput, dataFromSlash, charName);
	const embedCounter = embedCharCounter(embed);

	// Caracteres Totales del Mensaje (todo el embed).
	if (embedCounter.total > 6000) throw new EmbedCharRangeError(EMBED_CHAR_RANGE_ERRORS_SUBTYPES.TOTAL_MESSAGE_CHARS_EXCEEDED(input));

	// Caracteres Individuales de cada Tirada (de cada field).
	embedCounter.fields.text.forEach(field => {
		if (field.value.chars > 1024) throw new EmbedCharRangeError(EMBED_CHAR_RANGE_ERRORS_SUBTYPES.MAXIMUM_ROLL_CHARS_EXCEEDED(input));
	});
}

// Función para validar la notación de dados ingresada.
function validateDiceNotation (originalInput) {
	// Error: Unvalid Dice Notation.
	if (!originalInput.match(rollCommandRegex)) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.INVALID_DICE_NOTATION(originalInput));

	// Error: Invalid Parenthesis Syntax.
	const diceRollNotation = originalInput.match(rollCommandRegex)[0];
	const mathematicalSyntax = diceRollNotation.replaceAll(diceDetector, "1").replace(repetitionNotation, "");
	try { evaluate(mathematicalSyntax) } catch (error) { throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.INVALID_PARENTHESIS_SYNTAX(diceRollNotation)); }
}

// Función para validar los inputs iniciales enviados por el usuario, tanto los de texto como los slash.
function validateAllInitialInputData (dataFromSlash, dataFromText) {
	// Error: Two Titles.
	if (dataFromSlash.title && dataFromText.title) throw new ConflictDataError(CONFLICT_DATA_ERRORS_SUBTYPES.TWO_TITLES(dataFromSlash.title, dataFromText.title));

	// Error: Two Repetitions.
	if (dataFromSlash.repetitions && dataFromText.repetitions) throw new ConflictDataError(CONFLICT_DATA_ERRORS_SUBTYPES.TWO_REPETITIONS(dataFromSlash.repetitions, dataFromText.repetitions));

	// Error: Two AdvantageTypes.
	if (dataFromSlash.advantageType && dataFromText.advantageType) throw new ConflictDataError(CONFLICT_DATA_ERRORS_SUBTYPES.TWO_ADVANTAGETYPES(dataFromSlash.advantageType, dataFromText.advantageType));
}

// Función que verifica si la tirada en cuestión es un "Drop Zero".
function isDroppingZero(roll) {
	let result = false;
	const diceGroupsRolled = roll.match(diceDetector);
	diceGroupsRolled.forEach(dice => {
		const { keepdropingType, keepdropingAmount } = diceDestructuring(dice);
		const isDropping = (keepdropingType === "d") || (keepdropingType === "dh") || (keepdropingType === "dl");
		const isZero = (keepdropingAmount === 0);
		if (isDropping && isZero) result = true;
	});

	return result;
}

// Función que verifica si la tirada en cuestión es un "Keep Too Much".
function isKeepingTooMuch(roll) {
	let result = false;
	const diceGroupsRolled = roll.match(diceDetector);
	diceGroupsRolled.forEach(dice => {
		const { quantity, keepdropingType, keepdropingAmount } = diceDestructuring(dice);
		const isKeeping = (keepdropingType === "k") || (keepdropingType === "kh") || (keepdropingType === "kl");
		const isTooMuch = (keepdropingAmount >= quantity);
		if (isKeeping && isTooMuch) result = true;
	});

	return result;
}

// Función para validar los inputs finales antes de realizar los cálculos de dados.
function validateFinalInputData (roll, title, repetitions, advantageType) {
	// Error: Invalid Advantage Type Usage.
	if (advantageType && !isApplicable(roll)) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.INVALID_ADVANTAGETYPE_USAGE(roll));

	// Error: Too Long Title.
	if (title?.length > 240) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.TOO_LONG_TITLE(title));

	// Error: Maximum or Minimum Repetition Value Exceeded.
	if (repetitions < 1) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.NULL_REPETITIONS(roll)); // Minimum
	if (repetitions > 20) throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.MAX_REPETITIONS_EXCEEDED(roll)); // Maximum

		// Warning: Parameter in Title.
		if (title?.includes("--")) return WARNING_TYPES.PARAMETER_IN_TITLE(title);

		// Warning: Drop Zero.
		if (isDroppingZero(roll)) return WARNING_TYPES.DROP_ZERO(roll);

		// Warning: Keep Too Much.
		if (isKeepingTooMuch(roll)) return WARNING_TYPES.KEEP_TOO_MUCH(roll);
}

// Función para validar los rangos permititos de los parámetros de los dados.
function validateDiceRange (dice, fullRoll) {
	const { quantity, faces, keepdropingType, keepdropingAmount } = diceDestructuring(dice);

	if (quantity === 0) throw new DiceRangeError(DICE_RANGE_ERRORS_SUBTYPES.ZERO_DICE(fullRoll));
	if (faces === 0) throw new DiceRangeError(DICE_RANGE_ERRORS_SUBTYPES.ZERO_FACES(fullRoll));
	if (quantity > 100) throw new DiceRangeError(DICE_RANGE_ERRORS_SUBTYPES.MAX_DICE_EXCEEDED(fullRoll));
	if (faces > 1000) throw new DiceRangeError(DICE_RANGE_ERRORS_SUBTYPES.MAX_FACE_EXCEEDED(fullRoll));

	if (keepdropingType) {
		const amnt = keepdropingAmount;
		const type = keepdropingType.toLowerCase();

		// Keep Zero
		if (type[0] === "k" && amnt === 0)
			throw new DiceRangeError(DICE_RANGE_ERRORS_SUBTYPES.KEEP_ZERO(fullRoll));

		// Drop All
		if (type[0] === "d" && amnt >= quantity)
			throw new DiceRangeError(DICE_RANGE_ERRORS_SUBTYPES.DROP_ALL(fullRoll));
	}
}

module.exports = { validateDiceNotation, validateDiceRange, validateAllInitialInputData, validateFinalInputData, validateEmbedCharAmount }