const { SlashCommandBuilder, Guild, ChannelType } = require('discord.js')
const fs = require("fs")
const { ScheduledMessage } = require('../objects/ScheduledMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schedule-remove")
        .setDescription("Verwijder een bericht uit het schedule")
        .addStringOption(option =>
            option.setName("key")
                .setDescription("De key van het te verwijderen bericht")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        
        const { scheduledMessages } = require('../index.js');

        let key = parseInt(interaction.options.getString("key"));

    },

    info: "remove a scheduled message"
}
