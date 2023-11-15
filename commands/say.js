const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Laat Doddy iets zeggen")
        .addStringOption(option =>
            option.setName("tekst")
                .setDescription("De tekst die Doddy zal zeggen, gebruik \\n voor een nieuwe lijn."))
        .addStringOption(option =>
            option.setName("titel")
                .setDescription("De titel van het bericht dat Doddy zal zeggen"))
        .addAttachmentOption(option =>
            option.setName("foto")
                .setDescription("Een foto die Doddy bij het bericht voegt")),

    async execute(interaction) {
        let text = interaction.options.getString("tekst")
        let titel = interaction.options.getString("titel")
        let img = interaction.options.getAttachment("foto")

        let url

        if (text !== null) text = text.replaceAll("\\n", "\n")

        if (img == null) {
            url = ""
        } else {
            url = img.url
        }

        await interaction.channel.send({
            embeds: [{
                title: titel,
                description: text,
                image: {
                    url: url
                },
                color: 0xb9673c
            }]
        })

        await interaction.reply("Successfully spoken")
        await interaction.deleteReply()
    },

    info: "Laat Doddy iets zeggen"
}