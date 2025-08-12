const { diceDestructuring } = require("./others");
const { validateDiceRange } = require("./validators");
const { random } = require("../../instantiated_modules/mathjs");

// Generador de Números Aleatorios para los dados (incluyendo dados fate).
function getRandomNumber (maxValue) {
	if (maxValue === "f") return random(3)-1; // [-1, 0, 1]
	else return random(maxValue)+1; // [1, ..., maxValue]
}

// Función para tirar grupos de dados individuales (Ej.: 1d20, 3d12, 8d6, etc).
function rollDice (dice, fullRoll) {
	validateDiceRange(dice, fullRoll);
	const { quantity, faces, keepdropingType, keepdropingAmount } = diceDestructuring(dice);

	const result = {};
	result.diceRolled = dice;
	result.results = [];
	for (let i=0; i<quantity; i++) {
		result.results.push(getRandomNumber(faces)); // Random Number Generator
	}

	if (keepdropingType) { // KeepDroping
		let amnt = keepdropingAmount;
		const type = keepdropingType;

		if (type === "kh" || type === "k") { // Keep Highest
			if (keepdropingAmount > quantity) amnt = quantity;
			result.highests = [];
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const maxValue = Math.max(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === maxValue);
				result.highests.push(maxValue);
				relativeResults.splice(valueIndex, 1);
			}
		}
		if (type === "kl") { // Keep Lowest
			if (keepdropingAmount > quantity) amnt = quantity;
			result.lowests = [];
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const minValue = Math.min(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === minValue);
				result.lowests.push(minValue);
				relativeResults.splice(valueIndex, 1);
			}
		}
		if (type === "dl" || type === "d") { // Drop Lowest
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const minValue = Math.min(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === minValue);
				relativeResults.splice(valueIndex, 1);
			}
			result.highestsNotDropped = [...relativeResults];
		}
		if (type === "dh") { // Drop Highest
			const relativeResults = [...result.results];
			for (let i=0; i<amnt; i++) {
				const maxValue = Math.max(...relativeResults);
				const valueIndex = relativeResults.findIndex(x => x === maxValue);
				relativeResults.splice(valueIndex, 1);
			}
			result.lowestsNotDropped = [...relativeResults];
		}
	}

	const keys = Object.keys(result);
	// La razón por la cual aquí debajo ↴ hay un if-else es porque al final de todo el algoritmo, los resultados que se tienen que sumar serán diferentes dependiendo de si la tirada tuvo o no un "keepdropingType". Si no lo tuvo, el tamaño del objeto result será de 2 (porque tendrá la propiedad diceRolled y la propiedad results, sin embargo, si la tirada tuviera un keepdropingType el tamaño del objeto result al final será de 3 porque tendrá la propiedad diceRolled la propiedad results y la propiedad highest o lowest respectivamente, y en este último caso esos valores son los que se tienen que sumar y no los de results).
	if (keys.length > 2) result.total = result[keys[2]].reduce((a,b) => a+b);
	else result.total = result.results.reduce((a,b) => a+b);

	return result;
}

module.exports = { rollDice }