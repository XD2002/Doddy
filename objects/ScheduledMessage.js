class ScheduledMessage {
    constructor(key, time, user, channel, content, titel, foto, reactions, thread){
        this.key = key;
        this.time = time;
        this.user = user;
        this.channel = channel;
        this.content = content;
        this.titel = titel;
        this.foto = foto;
        this.reactions = reactions;
        this.thread = thread;
    }
}

module.exports = { ScheduledMessage }
