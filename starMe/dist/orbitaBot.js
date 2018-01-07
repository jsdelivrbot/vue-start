const Telegraf = require('telegraf');
const bot = new Telegraf('471562304:AAEbH3GBmibD1TXUxHtL6g9m9827Bhlt0z4');


bot.start((ctx) => {
  console.log('started:', ctx.from.id);
  return ctx.reply('Welcome!')
});

bot.command('help', (ctx) => ctx.reply('Try send a sticker!'));
bot.command('start', (ctx) => ctx.reply(''));
bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.hears(/buy/gi, (ctx) => ctx.reply('Buy-buy!'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.catch((err) => {
  console.log('Ooops', err)
})
bot.startPolling();
