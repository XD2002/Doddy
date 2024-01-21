const { SlashCommandBuilder, Guild, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const PriorityQueue = require('js-priority-queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schedule-list")
        .setDescription("Krijg een lijst met alle ingeplande berichten te zien."),

    async execute(interaction) {
        await interaction.deferReply();
        
        const { scheduledMessages, updateScheduledMessages } = require('../index.js');
        
        let messages = [];

        let offset = 0;
        
        let tableString = ``;

        let newScheduledMessages = new PriorityQueue({comparator: function(a,b) { return a.time-b.time; }});

        while (scheduledMessages.length > 0) {
            let message = scheduledMessages.dequeue();
            messages.push(message);
            newScheduledMessages.queue(message);
        }

        updateScheduledMessages(newScheduledMessages);
        
        

        const left = new ButtonBuilder()
            .setCustomId("left")
            .setLabel("◀️ ")
            .setStyle(ButtonStyle.Primary);

        const right = new ButtonBuilder()
            .setCustomId("right")
            .setLabel("▶")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(left, right);

        const response = await interaction.editReply({
            embeds: [{
                title: "Schedule",
            }]
        })

    },

    info: "Lijst alle ingeplande berichten op."
}
