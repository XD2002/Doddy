const { SlashCommandBuilder } = require('discord.js')
const fs = require("fs");
const PriorityQueue = require('js-priority-queue');

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
        
        const { scheduledMessages, updateScheduledMessages } = require('../index.js');

        let key = parseInt(interaction.options.getString("key"));

        fs.readFile("./resources/schedule.json", "utf8", (err, data) => {
            if(err){
                console.error(err);
                interaction.editReply("Oops, er liep iets verkeerd");
            } else {
                try {
                    let schedule = JSON.parse(data);
                    if (schedule[key] === undefined){
                        interaction.editReply("Je kan niet verwijderen wat niet bestaat, gaf je de juiste key mee?");
                        return;
                    }
                    delete schedule[key];
                    fs.writeFile("./resources/schedule.json", JSON.stringify(schedule), err => {
                        if (err) {
                            console.error(err);
                            interaction.editReply("Oops, er liep iets verkeerd");
                        }
                    })

                    let newScheduledMessages = new PriorityQueue({comparator: function(a,b) { return a.time-b.time; }});
                    
                    while (scheduledMessages.length > 0) {
                        let message = scheduledMessages.dequeue();
                        if (message.key !== key) {
                            newScheduledMessages.queue(message);
                        }
                    }

                    updateScheduledMessages(newScheduledMessages);

                    interaction.editReply("Bericht werd succesvol verwijderd");
                } catch (e) {
                    console.error(e);
                    interaction.editReply("Oops, er liep iets verkeerd");
                }
            }
        })
    },

    info: "remove a scheduled message"
}
