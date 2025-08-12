module.exports = {
	data: {
		name: "choose",
		description: "Selecciona aleatoriamente una de las opciones dadas.",
		aliases: ["elegir", "elige", "escoger", "escoge", "decidir", "decide", "seleccionar", "selecciona", "random", "azar"],
		regexes: []
	},

	async execute(message, input) {
		const chooseAnOption = message.client.functionalities.get("chooseAnOption");
		await chooseAnOption(message, input);
	}
}

// choose
// 	prefix + keyword:
// 		vchoose 1 2 3
// 		velegir 1 2 3
// 		velige 1 2 3
// 		vescoge 1 2 3
// 		vescoger 1 2 3
// 		vrandom 1 2 3
// 		vazar 1 2 3

// calculate
// 	prefix + keyword:
// 		vcalculate 1+1
// 		vcalcular 1+1
// 		vcalcula 1+1
// 		vcalc 1+1