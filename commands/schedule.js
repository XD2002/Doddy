const { SlashCommandBuilder } = require('discord.js')
const fs = require("fs")
const { scheduledMessages } = require('../index.js');
const { ScheduledMessage } = require('../objects/ScheduledMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Registreer een bericht dat Doddy op een meegegeven moment zal versturen")
        .addStringOption(option =>
            option.setName("tijd")
                .setDescription("Op welk moment moet Doddy dit bericht sturen? (formateer de datum als YYYY-MM-DD HH:mm)")
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
        .addAttachmentOption(option =>
            option.setName("foto")
                .setDescription("Foto die Doddy bij het bericht zal voegen.")
        )
        .addStringOption(option =>
            option.setName("reactions")
                .setDescription("Reacties die Doddy op het bericht zal plaatsen")
        ),

    async execute(interaction) {
        await interaction.deferReply();
        
        let time = new Date(interaction.options.getString("tijd").replaceAll(' ', 'T'));
        let channel = interaction.options.getChannel("kanaal");
        let content = interaction.options.getString("inhoud");
        let title = interaction.options.getString("titel");
        let photo = interaction.options.getAttachment("foto");
        let reactions = interaction.options.getString("reactions");

        let url;

        if (content !== null) content = content.replaceAll("\\n", "\n");

        if (photo == null) {
            url = "";
        } else {
            url = photo.url;
        }

        let message = new ScheduledMessage(0,time,interaction.user,channel,content,title,url,reactions);

        console.log(message);
    },

    info: "Schedule a message"
}
