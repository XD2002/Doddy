const { SlashCommandBuilder } = require('discord.js')
const fs = require("fs")
const { scheduledMessages } = require('../index.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Registreer een bericht dat Doddy op een meegegeven moment zal versturen")
        .addStringOption(option =>
            option.setName("tijd")
                .setDescription("Op welk moment moet Doddy dit bericht sturen? (formateer de datum als YYYY-MM-DD HH:mm, 11 juli 2024 om 11h30 is dan '2024-07-11 11:30')")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("kanaal")
                .setDescription("In welk kanaal moet Doddy dit bericht sturen?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("inhoud")
                .setDescription("Welke tekst moet het bericht bevatten, gebruik \\n als je een nieuwe lijn wil")
        )
        .addStringOption(option =>
            option.setName("titel")
                .setDescription("De titel van het bericht dat Doddy zal verzenden")
        )
        .addStringOption(option =>
            option.setName("foto")
                .setDescription("Foto die Doddy bij het bericht zal voegen, gebruik een link naar de afbeelding, als attachment is voor later")
        ),

    async execute(interaction) {
        await interaction.deferReply();
    },

    info: "Registreer je schaakaccount"
}
