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
const md5 = require('md5');
const md4 = require('js-md4');
const btoa = require('btoa')


let entities = jsonfile.readFileSync(entitiesFile);
entities = entities.map((e, i) => {
  e.idx = i;
  return e
});
let cities = entities.map(e => e.city).filter((v, i, a) => a.indexOf(v) === i);
let cityBtoaIndex = {};
let btoaCityIndex = {};
cities.map(e => cityBtoaIndex[e] = btoa(e));
cities.map(e => btoaCityIndex [btoa(e)] = e);
console.log(cityBtoaIndex);


bot.start((ctx) => {
  return ctx.reply('Welcome!\n /city')
});

bot.command('help', (ctx) => ctx.reply('Try send a sticker!'));
// bot.command('start', (ctx) => ctx.reply(''));
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
    myChoice.city = cities.indexOf(e);
    myChoice.s = 'city';
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

bot.action(/City|Price|Rooms|Result/gi, ctx => {
  let myChoice = JSON.parse(ctx.match.input);
  let buttons = [];
  let text = `
<b>City:</b>  ${cities[myChoice.city]}
${myChoice.p ? '<b>Price:</b>' + myChoice.p : ''}
${myChoice.rooms ? '<b>Rooms:</b> ' + myChoice.rooms : ''}
${myChoice.rIdx ? `<b>Phone</b>:${entities[myChoice.rIdx].phone}` : 'tap on result to view card'}
${myChoice.rIdx ? `<b>Area</b>:${entities[myChoice.rIdx].area}` : ''}
${myChoice.rIdx ? `${entities[myChoice.rIdx].fullText}` : ''}
    `;


  if (myChoice.s === 'city') {
    console.log('city');
    let prices = [1000, 2000, 3000, 4000, 5000, 6000, 7000];
    buttons = prices.map(e => {
      myChoice.s = 'price';
      myChoice.p = e;
      return [Markup.callbackButton(e, JSON.stringify(myChoice))]
    });
  }

  else if (myChoice.s === 'price') {

    let rooms = [1, 2, 3, 4, 5, 6, 7];
    buttons = rooms.map(e => {
      myChoice.s = 'rooms';
      myChoice.rooms = e;
      return Markup.callbackButton(e, JSON.stringify(myChoice))
    });
  }

  else if (myChoice.s === 'rooms') {
    myChoice.s = 'result';
    // console.log(cities[myChoice.city]);
    let resultsFull = entities.filter(e => e.rooms >= myChoice.rooms - 0 && e.price - 0 <= myChoice.p - 0 && e.city === cities[myChoice.city]);
    resultsFull = resultsFull.sort((a, b) => a.price / a.rooms - b.price / b.rooms);

    buttons = resultsFull.map(e => {
      myChoice.s = 'result';
      myChoice.rIdx = e.idx;
      myChoice.p = e.price;
      return [Markup.callbackButton('[🚪' + e.rooms + '][💴' + e.price + (e.images.length > 0 ? '][📷]' : ']') + '[🗺' + e.area + ']', JSON.stringify(myChoice))]
    });
  }

  else if (myChoice.s === 'result') {
    myChoice.s = 'theEnd';
    console.log(myChoice);
    // console.log(cities[myChoice.city]);
  }
  // console.log(buttons);
  ctx.replyWithHTML(text || '', Extra.markup(Markup.inlineKeyboard(buttons)))
    .then(e => {
      if (
        myChoice.s === 'theEnd' &&
        myChoice.rIdx &&
        entities[myChoice.rIdx].images.length > 0
      ) {
        let album = entities[myChoice.rIdx].images.map(e => {
          return {
            media: e,
            'caption': 'From URL',
            'type': 'photo'
          }
        });
        ctx.replyWithMediaGroup(album);
        myChoice.rIdx = undefined;
      }
    })
    .catch(er => {
      console.log(er);
    });


});


bot.catch((err) => {
  console.log('Ooops', err)
});

bot.startPolling();
