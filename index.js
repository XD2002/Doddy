require('http')
    .createServer(async (req, res) => {
        res.statusCode = 200;
        res.write('ok');
        res.end();
    })
    .listen(3000, () => console.log('Now listening on port 3000'));
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, AttachmentBuilder} = require('discord.js');
const { token } = require('./config.json');
const Canvas = require("@napi-rs/canvas");
const memeJson = require("./resources/meme.json")

const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath,file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    client.user.setPresence({
        activities:[ {
            name: "with you",
            type: ActivityType.Playing
        }]
    })
});

client.on(Events.InteractionCreate, async interaction => {

    if(interaction.isModalSubmit()) {

        if(interaction.customId.startsWith("memeModal")){
            let template = interaction.customId.slice(9)
            //const text1 = interaction.fields.getTextInputValue("text1")
            //const text2 = interaction.fields.getTextInputValue("text2")

            let json = memeJson[template]

            /** making the meme **/
            const canvas = Canvas.createCanvas(700, 700)
            const context = canvas.getContext('2d')
            const background = await Canvas.loadImage(`./images/meme/${template}.jpg`)

            context.drawImage(background, 0, 0, canvas.width, canvas.height)

            context.font = '40px Comic Sans MS';

            context.fillStyle = json["color"];

            for(let i = 1; i<json["size"]; i++){
                let text = interaction.fields.getTextInputValue(`text${i}`)
                context.fillText(text, canvas.width*json[`location${i}`]["x"], canvas.height*json[`location${i}`]["y"])
            }

            //context.fillText(text1, canvas.width*json["location1"]["x"], canvas.height*json["location1"]["y"])
            //context.fillText(text2, canvas.width*json["location2"]["x"], canvas.height*json["location2"]["y"])

            const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'meme.png' })

            interaction.reply({ content: `<@${interaction.user.id}>`, files: [attachment] })
        }

    } else if (interaction.isChatInputCommand()) {

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
});

client.on(Events.MessageCreate, async interaction => {
    if (interaction.author.bot) return
    if (interaction.mentions.has(client.user)) {
        await interaction.reply("hoi")
    } else {
        let abort = false
        const respPre = require('./resp.json');
        const resp = new Map(respPre)
        let it = resp.keys()
        let value = it.next()
        while (!value.done && !abort) {
            if (interaction.content.toLowerCase().includes(value.value.toString().toLowerCase())) {
                await interaction.channel.send(resp.get(value.value))
                abort = true
            }
            value = it.next()
        }
    }
})

client.login(token);