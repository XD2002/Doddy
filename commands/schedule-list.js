const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
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
        
        let newScheduledMessages = new PriorityQueue({comparator: function(a,b) { return a.time-b.time; }});

        while (scheduledMessages.length > 0) {
            let message = scheduledMessages.dequeue();
            messages.push(message);
            newScheduledMessages.queue(message);
            console.log("old: " + scheduledMessages.length);
            console.log("new: " + newScheduledMessages.length);
        }

        updateScheduledMessages(newScheduledMessages);
        
        let tableString = makeTable(messages, offset);

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

        let response = await interaction.editReply({
            embeds: [{
                title: "Schedule",
                description: tableString,
                color: 0xb9673c
            }],
            components: [row]
        })
        
        const collectorFilter = i => i.user === interaction.user;

        try {
            let confirmation = await response.awaitMessageComponent({filter: collectorFilter, max: 11, time: 60000})
            if (confirmation.customId === "left"){
                offset = Math.max(0,offset-5);
                tableString = makeTable(messages,offset);
                response = interaction.editReply({
                    embeds: [{
                        title: "Schedule",
                        description: tableString,
                        color: 0xb9673c
                    }],
                    components: [row]
                })
            }
            if (confirmation.customId === "right"){
                let newOffset = Math.min(messages.length, offset+5);
                offset = newOffset === messages.length ? offset : newOffset;
                tableString = makeTable(messages,offset);
                response = interaction.editReply({
                    embeds: [{
                        title: "Schedule",
                        description: tableString,
                        color: 0xb9673c
                    }],
                components: [row]
                })
            }
        } catch (e){
            console.log(e);
            await interaction.editReply({components: []});
        }
    },

    info: "Lijst alle ingeplande berichten op."
}

function makeTable(messages, offset){
    let table = "";
    for (let i=offset; i<Math.min(messages.length, offset+5); i++){
        let message = messages[i];
        table += `- ${message.key}\n`;
    }
    return table;
}
