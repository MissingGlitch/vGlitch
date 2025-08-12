const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("calculate")
		.setDescription("Realiza operaciones matemáticas")
		.addStringOption(option => option
			.setName("operación")
			.setDescription("La operación matemática que deseas calcular")
			.setRequired(true)
			.setMaxLength(300)
		)
		.addStringOption(option => option
			.setName("título")
			.setDescription("El título o nombre del cálculo a relizar")
			.setMaxLength(300)
		),

	async execute(interaction) {
		const title = interaction.options.getString("título")?.trim();
		const operation = interaction.options.getString("operación")?.trim();

		const calculate = interaction.client.functionalities.get("calculate");
		await calculate(interaction, operation, title);
	}
}