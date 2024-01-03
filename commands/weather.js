const { SlashCommandBuilder } = require('discord.js');
const { NoLocationFoundError } = require('../errors/noLocationFoundError');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Bekijk de weersvoorspellingen")
        .addStringOption(option =>
            option.setName("locatie")
                .setDescription("De locatie waarvoor je de weersvoorspellingen wil bekijken")
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        let location = interaction.options.getString("locatie");
        try {
            let fc = getForecast(location);

        } catch (e) {
            if (e instanceof NoLocationFoundError){
                interaction.editReply("Deze locatie werd niet gevonden op Doddy's wereldbol");
            } else {
                interaction.editReply("Oops, er liep iets verkeerd, contacteer staff");
            }
        }
    },

    info: "Bekijk de weersvoorspellingen voor een bepaalde locatie"
}

async function getForecast(location){
    let locResp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=en&format=json`);
    let loc = await locResp.json();
    console.log(loc);
    if (loc.results == undefined){
        throw new NoLocationFoundError();
    }
    let latitude = loc.results[0].latitude;
    let longitude = loc.results[0].longitude;
    let resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`);
    let fc = await resp.json();
    console.log(fc);
    return fc.daily;
}
