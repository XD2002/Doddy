const { SlashCommandBuilder } = require("discord.js")
const axios = require("axios")
const fs = require("fs")
const { NotRegisteredError } = require("../errors/notRegisteredError")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("chessplayer")
        .setDescription("Zie informatie over een online schaakaccount")
        .addStringOption(option =>
            option.setName("schaaksite")
                .setDescription("Van welke site moet Doddy de info ophalen?")
                .addChoices(
                    //{name: "Lichess", value: "lichess"},
                    {name: "Chess.com", value: "chess.com"}
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName("username")
                .setDescription("Wat is de username van de persoon waarvoor je de data wil ophalen?"))
        .addStringOption(option =>
            option.setName("tag")
                .setDescription("Discordtag van de persoon waarvoor je de data wil opvragen")
        ),

    async execute(interaction){
        await interaction.deferReply()

        let site= interaction.options.getString("schaaksite")
        let username= interaction.options.getString("username")
        let tag = interaction.options.getString("tag")

        if(username === null){
            let discorduser = interaction.user
            if(tag !== null){
                discorduser = tag
            }
            fs.readFile("./commands/chessregister/chessregister.json", "utf8", (err,data) => {
                if(err){
                    console.log(err)
                    interaction.editReply("Oops, er liep iets verkeerd, contacteer staff.")
                }else{
                    try {
                        let register = JSON.parse(data)
                        if(discorduser in register[site]){
                            username = register[site][discorduser]
                        }else{
                            throw new NotRegisteredError(`${discorduser} is niet geregistreerd`)
                        }
                        getDataAndDisplay(site, interaction, username)
                    } catch (e) {
                        if (e instanceof NotRegisteredError){
                            console.log(e)
                            interaction.editReply("Deze gebruiker is niet geregistreerd")
                        } else {
                            console.log(e)
                            interaction.editReply("Oops, er liep iets verkeerd, contacteer staff.")
                        }
                    }
                }
            })
        }else{
            getDataAndDisplay(site,interaction,username)
        }
    }
}

async function getDataAndDisplay(site, interaction, username){
    switch (site){
        case "lichess":
            await interaction.editReply({
                embeds: [{
                    title: "Chessplayer",
                    description: "de zoekfunctie voor Lichess.org is nog niet geïmplementeerd, nog even geduld",
                    color: 0xb9673c
                }]
            })
            break

        case "chess.com":
            axios.get(`https://api.chess.com/pub/player/${username}/stats`)
                .then(response => {
                    return response.data
                }).then(
                response => {
                    let rapid = bullet = blitz = puzzle = 0
                    if (response.chess_rapid !== undefined){
                        rapid = response.chess_rapid.last.rating
                    }
                    if (response.chess_bullet !== undefined){
                        bullet = response.chess_bullet.last.rating
                    }
                    if (response.chess_blitz !== undefined){
                        blitz = response.chess_blitz.last.rating
                    }
                    if (response.tactics !== undefined){
                        puzzle = response.tactics.highest.rating
                    }
                    interaction.editReply({
                        embeds: [{
                            title: username,
                            description: `informatie over [${username}](https://www.chess.com/member/${username})`,
                            fields: [
                                {
                                    name: "🕒 Rapid",
                                    value: `elo: ${rapid}`
                                },
                                {
                                    name: "🔫 Bullet",
                                    value: `elo: ${bullet}`
                                },
                                {
                                    name: "⚡ Blitz",
                                    value: `elo: ${blitz}`
                                },
                                {
                                    name: "🧩 Puzzle",
                                    value: `elo: ${puzzle}`
                                }
                            ],
                            color: 0xb9673c
                        }]
                    })
                }
            )
                .catch(error => {
                    console.log(error);
                    interaction.editReply("Deze user werd niet gevonden.")
                });
    }
}