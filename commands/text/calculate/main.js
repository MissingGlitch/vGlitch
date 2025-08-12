module.exports = {
	data: {
		name: "calculate",
		description: "Realiza operaciones matemáticas.",
		aliases: ["calcular", "calcula", "calc", "cal"],
		regexes: []
	},

	async execute(message, input) {
		const calculate = message.client.functionalities.get("calculate");
		await calculate(message, input);
	}
}

// calculate
// 	prefix + keyword:
// 		vcalculate 1+1
// 		vcalcular 1+1
// 		vcalcula 1+1
// 		vcalc 1+1
// 		vcal 1+1