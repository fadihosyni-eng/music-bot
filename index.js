const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YtDlpPlugin } = require("@distube/yt-dlp");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new YtDlpPlugin()],
});

client.once("ready", () => {
  console.log(`Bot is online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const [cmd, ...args] = message.content.split(" ");
  const query = args.join(" ");

  if (cmd === "!play") {
    if (!message.member.voice.channel)
      return message.reply("ادخل روم صوتي أولاً.");

    distube.play(
      message.member.voice.channel,
      query,
      { textChannel: message.channel, member: message.member }
    );
  }

  if (cmd === "!skip") distube.skip(message);
  if (cmd === "!stop") distube.stop(message);
});

client.login(process.env.BOT_TOKEN);
