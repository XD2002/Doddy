const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Bekijk de weersvoorspellingen")
        .addStringOption(option =>
            option.setName("locatie")
                .setDescription("De locatie waarvoor je de weersvoorspellingen wil bekijken")
                .setRequired(true)),

    async execute(interaction) {
        console.log("NOG AANPASSEN");
    },

    info: "Bekijk de weersvoorspellingen voor een bepaalde locatie"
}
