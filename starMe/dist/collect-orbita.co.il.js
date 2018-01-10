const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let csvFile = 'parse-orbita.co.il.entities.csv';
let arrayFile = 'parse-orbita.co.il.array.json';
let entitiesFile = 'parse-orbita.co.il.entities.json';
let json2csv = require('json2csv');
let fs = require('fs');

let scrape = async () => {


  //renew file
  await jsonfile.writeFileSync(entitiesFile, [], {spaces: 1});

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1920});

  let items = await jsonfile.readFileSync(arrayFile);
  let entities = await jsonfile.readFileSync(entitiesFile);

  // for (let i = 0; i < 100; i++) {
  for (let i in items) {
    await page.goto(items[i]);
    let entity = {};
    let captionText = '';
    try {
      captionText = await page.$$eval('.caption .row div', items => items.map(item => item.innerText));

      // console.log(captionText);
      entity.type = captionText[0];
      entity.city = captionText[1];
      entity.date = captionText[2];

      let detailText = await page.$$eval('.infodetail .row div', items => items.map(item => item.innerText));
      // console.log(detailText);
      for (let j = 0; j < (detailText.length - 1) / 2; j++) {
        entity[detailText[j * 2]] = detailText[j * 2 + 1];
      }

      let infoText = await page.$$eval('.information', items => items.map(item => item.innerText));
      entity.fullText = infoText[0];

      let msgInfo = await page.$$eval('.row.message-info div', items => items.map(item => item.innerText));
      let phone = msgInfo[msgInfo.length - 1].split(':');
      entity[phone[0]] = phone[1];

      let images = await page.$$eval('.row.images-all a.thumbnail.preview', items => items.map(item => item.href));
      entity.images = images;


      entity =
        JSON.parse(
          JSON.stringify(entity)
            .replace('Цена:', 'price')
            .replace('Мебель:', 'furniture')
            .replace('Этаж:', 'floor')
            .replace('Комнаты:', 'rooms')
            .replace('Район/Улица:', 'area')
            .replace(/Не указано/g, '-')
            .replace(/Тел/g, 'phone')
            .replace(/ шек\./gi, '')
        );

      entities.push(entity);


      await jsonfile.writeFileSync(entitiesFile, entities, {spaces: 1});
      console.log('---------------------------------\n', entity.city, i, '\n---------------------------------',);
    } catch (err) {
      console.log(err)
    }

    // console.log('---------------------------------\n', entity, '\n---------------------------------',);
  }


  let fields = [];
  for (let i in entities[0]) {
    fields.push(i);
  }

  let csv = json2csv({data: entities, fields: fields});

  fs.writeFile(csvFile, csv, function (err) {
    if (err) throw err;
    console.log('file saved');
  });


  await page.close();
  await browser.close();
};


scrape();
