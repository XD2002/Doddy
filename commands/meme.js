const { SlashCommandBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js')
const memeJson = require("../resources/meme.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Maak een meme")
        .addStringOption(option =>
            option.setName("template")
                .setDescription("Welk memetemplate wil je gebruiken?")
                .addChoices(
                    {name: "Drake approves/disapproves", value: "Drake"},
                    {name: "Connected minds", value: "Minds"})
                .setRequired(true)),

    async execute(interaction) {
        let template = interaction.options.getString("template")

        let json = memeJson[template]

        const confirm = new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('Confirm')
            .setStyle(ButtonStyle.Success)

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        console.log(json["link"])

        const response = await interaction.reply({
            embeds: [{
                title: "Memegenerator",
                description: "Is dit het template dat je wil gebruiken?\nIndien ja, onthoud dan de locatie van de getallen en klik confirm.\nIndien neen, klik dan op cancel.",
                image: {
                    url: json["link"]
                },
                color: 0xb9673c
            }],
            components: [row],
            ephemeral: true
        })

        const collectorFilter = i => i.user === interaction.user

        try {
            const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60000})
            if(confirmation.customId === "confirm"){
                const modal = new ModalBuilder()
                    .setCustomId(`memeModal${template}`)
                    .setTitle('Memegenerator');

                /*
                const text1Input = new TextInputBuilder()
                    .setCustomId('text1')
                    .setLabel("1")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const text2Input = new TextInputBuilder()
                    .setCustomId('text2')
                    .setLabel("2")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const firstActionRow = new ActionRowBuilder().addComponents(text1Input);
                const secondActionRow = new ActionRowBuilder().addComponents(text2Input);

                modal.addComponents(firstActionRow, secondActionRow);*/

                for (let i = 1; i<json["size"]; i++){
                    const textInput = new TextInputBuilder()
                        .setCustomId(`text${i}`)
                        .setLabel(`${i}`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false);

                    const actionRow = new ActionRowBuilder().addComponents(textInput);

                    modal.addComponents(actionRow)
                }
                await confirmation.showModal(modal)
                //await confirmation.update({ content: `confirm`, embeds: [], components: [] });
            } else if (confirmation.customId === 'cancel') {
                await confirmation.update({ content: 'cancel', embeds: [], components: [] });
            }
        } catch (e) {
            console.log(e)
            await interaction.editReply({ content: 'Je hebt niet binnen de minuut geantwoord, Doddy gaat terug slapen.', embeds: [], components: []});
        }

        /** making the meme **/
        /*const canvas = Canvas.createCanvas(700, 700)
        const context = canvas.getContext('2d')
        const background = await Canvas.loadImage(`./images/meme/${template}.jpg`)

        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        context.font = '50px Comic Sans MS';

        context.fillStyle = '#000000';

        context.fillText(text1, canvas.width*3.2/5, canvas.height/4)
        context.fillText(text2, canvas.width*3.2/5, canvas.height*3/4)

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'meme.png' })

        //interaction.reply({ files: [attachment] })*/
    },

    info: "Maak een meme"
}