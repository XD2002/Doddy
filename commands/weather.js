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
            let fc = await getForecast(location);
            let days = fc.time;
            let codes = fc.weather_code;
            let min = fc.temperature_2m_min;
            let max = fc.temperature_2m_max;
            let country = fc.country;

            let fields = [];
            
            for (i in days){
                let date = new Date(days[i]);
                let dateOptions = { year: "numeric", month: "short", day: "numeric" };

                let code = codes[i];
                let weathericon = code;
                if ([2].includes(code)) {
                    weathericon = "☀️";
                }
                if ([3].includes(code)) {
                    weathericon = "☁️";
                }
                if ([50,51,52,53,54,55,56,57,58,59,60,61,62,63,65,65,66,67,68,69,80,81,82].includes(code)) {
                    weathericon = "🌧️";
                }
                if ([70,71,72,73,74,75,76,77,78,79].includes(code)) {
                    weathericon = "❄️";
                }

                let field = {
                    name: date.toLocaleDateString("nl", dateOptions),
                    value: `${weathericon}\n🔽 ${min[i]}°C\t🔼 ${max[i]}°C`,
                    inline: true
                }
                fields[i] = field;
            }

            interaction.editReply({
                embeds: [{
                    title: `Weer in ${location} (${country})`,
                    fields: fields,
                    color: 0xB9683C
                }]
            })
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
    if (loc.results == undefined){
        throw new NoLocationFoundError();
    }
    let latitude = loc.results[0].latitude;
    let longitude = loc.results[0].longitude;
    let country = loc.results[0].country_code;
    let resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`);
    let fc = await resp.json();
    let retFc = fc.daily;
    retFc["country"] = country;
    return retFc;
}
