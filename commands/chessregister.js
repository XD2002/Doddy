const { SlashCommandBuilder } = require('discord.js')
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chessregister")
        .setDescription("Registreer je schaakaccount")
        .addStringOption(option =>
            option.setName("schaaksite")
                .setDescription("Op welke site bevindt het te registreren account zich?").addChoices(
                    //{name: "Lichess", value: "lichess"},
                    {name: "Chess.com", value: "chess.com"}
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Hoe heet het account dat je wil registreren?")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply()

        let site=interaction.options.getString("schaaksite")
        let username=interaction.options.getString("username")


        fs.readFile("./commands/chessregister/chessregister.json", "utf8",  (err, data) => {
            if(err){
                console.log(err)
                interaction.editReply("Oops, er liep iets verkeerd, contacteer staff.")
            }else{
                try {
                    let register = JSON.parse(data)
                    let user = interaction.user
                    register[site][user] = username
                    fs.writeFile("./commands/chessregister/chessregister.json", JSON.stringify(register), err => {
                        if(err){
                            console.log(err)
                            interaction.editReply("Oops, er liep iets verkeerd, contacteer staff.")
                        }else{
                            interaction.editReply("Je bent succesvol geregistreerd.")
                        }
                    })
                }catch (e){
                    console.log(e)
                    interaction.editReply("Oops, er liep iets verkeerd, contacteer staff.")
                }
            }
        })
    },

    info: "Registreer je schaakaccount"
}