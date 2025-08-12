const { InputDataError,	INPUT_DATA_ERRORS_SUBTYPES } = require("./errors.js");

function validateOperation(operation) {
	if (operation.length > 300) {
		throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.TOO_LONG_OPERATION(operation));
	}

	const invalidCharacters = ["{", "}", "[", "]", ";", "\\", "?", "'", `"`];
	if (invalidCharacters.some(char => operation.includes(char))) {
		throw new InputDataError(INPUT_DATA_ERRORS_SUBTYPES.INVALID_CHARACTERS(operation));
	}
}

module.exports = { validateOperation };