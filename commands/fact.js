const { SlashCommandBuilder } = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
const {env} = require('custom-env');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Geeft een willekeurig weetje.')
        .addStringOption(option =>
            option.setName("thema")
                .setDescription("Thema waar je een weetje over wil.")),

    async execute(interaction) {
        await interaction.deferReply()
        const thema = interaction.options.getString("thema") ?? "iets willekeurig";
        const themaTitle = interaction.options.getString("thema") ?? "willekeurig"

        env("doddy")
        this.configuration = new Configuration({
            apiKey: process.env.API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);

        try {
            const completion = await this.openai.createCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    //{ role: "system", content: "Jij bent Doddy, een zeer intelligente beer."},
                    //{ role: "user", content: "Wie ben jij??"},
                    //{ role: "assistant", content: "Ik ben Doddy. Een intelligente beer."},
                    //{ role: "user", content: "Waar leef jij?" },
                    //{ role: "assistant", content: "Ik woon in deze server, FFoT, een server beheerd door Xander."},
                    { role: "user", content: `Vertel me een weetje over ${thema}` }
                ],
                max_tokens: 500
                //model: "text-davinci-003",
                //prompt: `Vertel me een weetje over ${thema}`,
                //max_tokens: 1000
            });

            console.log(completion.data.choices[0].text)
            await interaction.editReply({
                embeds: [{
                    title: themaTitle + " weetje",
                    description: completion.data.choices[0].message.content,
                    color: 0xb9673c
                }],
                ephemeral: true
            });
        } catch (e) {
            console.log(e);
            await interaction.reply("Er liep iets mis, probeer opnieuw.")
        }
    },

    info: "Krijg een interessant weetje van Doddy"
};