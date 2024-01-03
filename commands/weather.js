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
        const suggestie = interaction.options.getString("suggestie")

        await interaction.client.channels.cache.get(`768466246415941652`).send({
            embeds: [{
                title: `Suggestie van ${interaction.user.username}`,
                description: suggestie,
                thumbnail: {
                    url: interaction.user.avatarURL()
                },
                color: 0xb9673c
            }]
        }).then(
            function (message) {
                message.react("👍")
                message.react("👎")
            }
        )

        await interaction.reply({
            content: "Dankjewel voor de suggestie",
            ephemeral: true
        })
    },

    info: "Dien een suggestie in om de server beter te maken"
}
