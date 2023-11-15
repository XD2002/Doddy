const { SlashCommandBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Maak een poll")
        .addStringOption(option =>
            option.setName("vraag")
                .setDescription("De vraag die gesteld wordt")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("opties")
                .setDescription("De opties waaruit gekozen kan worden, scheid iedere optie door een komma (,), maximaal 4 opties")
                .setRequired(true)),

    async execute(interaction) {
        let question = interaction.options.getString("vraag")
        let options = interaction.options.getString("opties").split(',')

        let symbArr = [":one:", ":two:", ":three:", ":four:"];
        let votes = Array.from({ length: options.length }, () => 0);
        let voters = Array.from({ length: options.length }, () => [])

        if (options.length > symbArr) {
            interaction.reply("Er werden te veel opties opgegeven")
        } else {
            let pollString = ""
            const row = new ActionRowBuilder()
            for (let i = 0; i < options.length; i++) {
                pollString += symbArr[i] + " " + options[i] + ": " + votes[i] + "\n";
                let button = new ButtonBuilder()
                    .setCustomId(i.toString())
                    .setLabel(options[i])
                    .setStyle(ButtonStyle.Primary)
                row.addComponents(button)
            }
            let cancel = new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("❌")
                .setStyle(ButtonStyle.Danger)
            row.addComponents(cancel)
            const response = await interaction.channel.send({
                embeds: [{
                    title: question,
                    description: pollString,
                    color: 0xb9673c
                }],
                components: [row]
            })

            await interaction.reply("Poll made")
            await interaction.deleteReply()

            let run = true
            while(run) {
                const confirmation = await response.awaitMessageComponent()
                let num = confirmation.customId

                let conti = true
                if (num === "cancel" && confirmation.member._roles.includes("781459756363153458")) {
                    run = false
                    response.edit({
                        embeds: [{
                            title: `${question} (BEËINDIGD)`,
                            description: `RESULTATEN:\n${pollString}`,
                            color: 0xb9673c
                        }],
                        components: []
                    })
                } else if (num === "cancel") {
                    conti = false
                } else {
                    num = parseInt(num)
                }
                if (conti && run) {
                    if (!(voters[num].includes(confirmation.user.username))) {
                        voters[num].push(confirmation.user.username)
                        votes[num]++

                        console.log(votes)
                        console.log(confirmation.user.username)
                        console.log(voters)

                        pollString = ""
                        for (let i = 0; i < options.length; i++) {
                            pollString += symbArr[i] + " " + options[i] + ": " + votes[i] + "\n";
                        }

                        response.edit({
                            embeds: [{
                                title: question,
                                description: pollString,
                                color: 0xb9673c
                            }]
                        })

                        let resultsString = ""
                        for (let i = 0; i < options.length; i++) {
                            resultsString += symbArr[i] + " " + options[i] + ": " + voters[i].toString() + "\n";
                        }

                        await interaction.client.channels.cache.get(`760928813881884744`).send({
                            embeds: [
                                {
                                    title: question,
                                    description: resultsString
                                }
                            ]
                        })

                        await confirmation.user.send(`Je stemde op ${options[num]} in de poll "${question}"`)
                    } else {
                        await confirmation.user.send(`Je kan niet nog eens op ${options[num]} in de poll "${question}" stemmen`)
                    }
                }
            }
        }
    },

    info: "Maak een poll"
}