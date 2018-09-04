import * as dotenv from "dotenv";
import * as Botkit from "botkit";

dotenv.config()

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const controler = Botkit.slackbot({
  debug: false
})

const bot = controler.spawn({
  token: process.env.token
}).startRTM()

controler.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', (bot, message) => {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face'
  }, (err, res) => {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  controler.storage.users.get(message.user, (err, user) => {
    bot.botkit.log('user', user)

    if (user && user.name) {
      bot.reply(message, 'Hello ' + user.name + '!!');
    } else {
      bot.reply(message, 'Hello.');
    }
  })
})
