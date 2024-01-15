const { SlashCommandBuilder, Guild, ChannelType } = require('discord.js')
const fs = require("fs")
const { ScheduledMessage } = require('../objects/ScheduledMessage.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("schedule-add")
        .setDescription("Registreer een bericht dat Doddy op een meegegeven moment zal versturen")
        .addStringOption(option =>
            option.setName("tijd")
                .setDescription("Op welk moment moet Doddy dit bericht sturen? (formateer de datum als YYYY-MM-DD HH:mm)")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName("kanaal")
                .setDescription("In welk kanaal moet Doddy dit bericht sturen?")
                .addChannelTypes(ChannelType.GuildText)
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
                .setDescription("Reacties die Doddy op het bericht zal plaatsen, splitsen met een spatie.")
        ),

    async execute(interaction) {
        await interaction.deferReply();
        
        const { scheduledMessages } = require('../index.js');

        let time = new Date(interaction.options.getString("tijd").replaceAll(' ', 'T'));
        let channel = interaction.options.getChannel("kanaal");
        let content = interaction.options.getString("inhoud") ?? "";
        let title = interaction.options.getString("titel") ?? "";
        let photo = interaction.options.getAttachment("foto");
        let reactions = interaction.options.getString("reactions") ?? "";

        let url;

        if (content !== null) content = content.replaceAll("\\n", "\n");

        if (photo == null) {
            url = "";
        } else {
            url = photo.url;
        }

        if (time < new Date()) {
            interaction.editReply("Het meegegeven tijdstip ligt in het verleden, Doddy kan veel, maar tijdreizen helaas nog niet.");
            return
        }

        if (title === "" && content === "" && url === ""){
            interaction.editReply("Titel, inhoud en foto mogen niet tegelijk leeg zijn.");
            return
        }

        let key = Date.now();

        let message = new ScheduledMessage(key,time,interaction.user.id,channel.id,content,title,url,reactions);
        console.log(message);
        fs.readFile("./resources/schedule.json", "utf8", (err, data) => {
            if(err){
                console.error(err);
                interaction.editReply("Oops, er liep iets verkeerd.");
            } else {
                try {
                    let schedule = JSON.parse(data);
                    schedule[message.key] = message;
                    fs.writeFile("./resources/schedule.json", JSON.stringify(schedule), err => {
                        if(err){
                            console.error(err);
                            interaction.editReply("Oops, er liep iets verkeerd");
                        } else {
                            scheduledMessages.queue(message);

                            interaction.editReply({
                                content: `Doddy noteerde het in zijn boekje.\nin <#${channel.id}> om ${time} met key: ${key}`,
                                embeds: [{
                                    title: title,
                                    description: content,
                                    image: {
                                        url: url
                                    },
                                    color: 0xb9673c
                                }]
                            }).then(
                                function (message) {
                                    if (reactions !== ""){
                                        let emotes = reactions.split(' ');
                                        for (let emote of emotes){
                                            message.react(emote);
                                        }
                                    }
                                }
                            )
                        }
                    })
                } catch (e) {
                    console.error(e);
                    interaction.editReply("Oops, er liep iets verkeerd.");
                }
            }
        })
    },

    info: "Schedule a message"
}
