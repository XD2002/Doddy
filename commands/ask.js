const { SlashCommandBuilder } = require('discord.js');
const {Configuration, OpenAIApi} = require('openai');
const {env} = require('custom-env');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Stel Doddy een vraag')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question to answer')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply()
        const question = interaction.options.getString('question')

        env("doddy")
        this.configuration = new Configuration({
            apiKey: process.env.API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);

        const completion = await this.openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                //{ role: "system", content: "Jij bent Doddy, een zeer intelligente beer."},
                //{ role: "user", content: "Wie ben jij??"},
                //{ role: "assistant", content: "Ik ben Doddy. Een intelligente beer."},
                //{ role: "user", content: "Waar leef jij?" },
                //{ role: "assistant", content: "Ik woon in deze server, FFoT, een server beheerd door Xander."},
                { role: "user", content: question }
            ],
            max_tokens: 500
            //model: "text-davinci-003",
            //prompt: question,
            //max_tokens: 1000
        });

        await interaction.editReply({
            embeds: [{
                title: question,
                description: completion.data.choices[0].message.content,
                color: 0xb9673c
            }]
        });
    },

    info: "Stel Doddy een vraag"
};