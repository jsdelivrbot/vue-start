const Telegraf = require('telegraf');
const bot = new Telegraf('471562304:AAEbH3GBmibD1TXUxHtL6g9m9827Bhlt0z4');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');
const Router = require('telegraf/router');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let csvFile = 'parse-orbita.co.il.entities.csv';
let arrayFile = 'parse-orbita.co.il.array.json';
let entitiesFile = 'parse-orbita.co.il.entities.json';
let json2csv = require('json2csv');
let fs = require('fs');
let entities = jsonfile.readFileSync(entitiesFile);


bot.start((ctx) => {
  return ctx.reply('Welcome!\n /city')
});

bot.command('help', (ctx) => ctx.reply('Try send a sticker!'));
bot.command('start', (ctx) => ctx.reply(''));
bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
bot.hears(/buy/gi, (ctx) => ctx.reply('Buy-buy!'));
bot.hears(/\[/gi, (ctx) => ctx.reply(']'));

bot.on('sticker', (ctx) => ctx.reply('👍'));


bot.command('city', (ctx) => {
  // console.log(entities);
  let cityArray = entities.map(e => e.city);
  cityArray = cityArray.filter((v, i, a) => a.indexOf(v) === i);

  let buttons = cityArray.map(e => {
    let myChoice = {};
    myChoice.city = e;
    myChoice.step = 'city';
    return [Markup.callbackButton(e, JSON.stringify(myChoice))]
  });
  return ctx.reply('Cities:', Extra.markup(Markup.inlineKeyboard(buttons)))
});


bot.command('random', (ctx) => {
  return ctx.reply('random example',
    Extra.markup(Markup.inlineKeyboard([
      Markup.callbackButton('Coke', 'Coke'),
      Markup.callbackButton('Dr Pepper', 'Pepper'),
      Markup.callbackButton('Pepsi', 'Pepsi')
    ]))
  )
});

bot.on('text', (ctx) => {
  ctx.reply(`Hello ${ctx.state.role || 123}`);
});

bot.action(/Coke|Pepsi|Pepper/gi, ctx => {
  try {
    ctx.editMessageText('Choosen: ' + ctx.match.input,
      Extra.markup(Markup.inlineKeyboard([
        Markup.callbackButton('0', 'Coke'),
        Markup.callbackButton('1', 'Pepper'),
        Markup.callbackButton('2', 'Pepsi')
      ])));
  }
  catch (err) {
    console.log(err);
  }
  console.log(ctx);
});

bot.action(/City|Price|Rooms/gi, ctx => {
  let myChoice = JSON.parse(ctx.match.input);
  let buttons = [];
  let text = '';
  if (myChoice.step === 'city') {
    text = 'Choose price:';
    let prices = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
    buttons = prices.map(e => {
      myChoice.step = 'price';
      myChoice.price = e;
      return [Markup.callbackButton(e, JSON.stringify(myChoice))]
    });
    // ctx.editMessageText('Choosen: ' + myChoice.step, Extra.markup(Markup.inlineKeyboard(pricesButtons)));
  } else if (myChoice.step === 'price') {
    text = 'Choose number of rooms:';
    let rooms = [1, 2, 3, 4, 5, 6, 7];
    buttons = rooms.map(e => {
      myChoice.step = 'rooms';
      myChoice.rooms = e;
      return Markup.callbackButton(e, JSON.stringify(myChoice))
    });
  } else if (myChoice.step === 'rooms') {
    text = 'Your result:';
    myChoice.step = 'result';
    let results = [];
    let resultsFull = entities.filter(e => e.rooms >= myChoice.rooms-0 && e.price <= myChoice.price-0 && e.city === myChoice.city);
    results = resultsFull.map(e => e.phone);
    buttons = resultsFull.map(e => {
      // myChoice.result = e;
      // myChoice.phone = e.phone;
      myChoice.step = 'result';
      return [Markup.callbackButton(e.phone || 'no phone', JSON.stringify(myChoice))]
    });
  }

  console.log(buttons);

  ctx.reply(text || '', Extra.markup(Markup.inlineKeyboard(buttons)))
    .then(e => {
    })
    .catch(er => {
      console.log(er);
    });


});


bot.catch((err) => {
  console.log('Ooops', err)
});

bot.startPolling();
