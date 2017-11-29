const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';

let scrape = async () => {
  let puppeteerDb = await MongoClient.connect(db.url);
  const browser = await puppeteer.launch({headless: false});
  let startPage = 2350;
  let powIndex = 100;
  let diaCount = 10;
  let diapasones = [];
  for (let h = startPage; h < startPage + powIndex * diaCount; h += powIndex) {
    diapasones.push({
      start: h,
      stop: h + powIndex
    })
  }
  console.log(diapasones);
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});
  for (let diaIndex in diapasones) {
    let links = [];
    for (let i = diapasones[diaIndex].start; i <= diapasones[diaIndex].stop; i++) {
      await page.goto('http://ktozvonit.ru/latest/' + i);
      links = links.concat(await page.$$eval('div.description a[href*="nomer"]', links => links.map(link => link.href)));
      // console.log(links.length);
    }
    links = links.filter((v, i, a) => a.indexOf(v) === i);
    // console.log(links.length);
    {
      let phones = links.map(lnk => lnk.split('/')[lnk.split('/').length - 1]);
      let phonesQuery = phones.map(phone => {
        return {phone: phone}
      });
      // without update
      let query = {$or: phonesQuery};
      console.log('QUERY', JSON.stringify(query));
      let found = await puppeteerDb.collection('arrticles').find(query).toArray();
      let foundPhones = found.map(f => f.phone);
      foundPhones = foundPhones.filter((v, i, a) => a.indexOf(v) === i);
      console.log(JSON.stringify(foundPhones));
      links = links.filter((v) => foundPhones.indexOf(v.split('/')[v.split('/').length - 1]) === -1);
    }
    // console.log(links);
    let artcilesObects = [];
    for (let k in links) {
      console.log(links[k], '[', k, '/', links.length, ']');
      await page.goto(links[k]);
      //alt nums
      // numberHeader
      let altNums = await page.$eval('div.numberHeader small', description => description.innerText);
      altNums = altNums.split(',');
      // console.log(altNums);
      // description
      let descriptions = await page.$$eval('div#content > div.container div.record div.description div.smaller span span', descriptions => descriptions.map(description => description.innerText));
      // console.log(descriptions);
      // comments about number
      // todo set unique ids to articles
      let articles = await page.$$eval('main article', artciles => artciles.map(article => article.id));

      let query = {phone: links[k].split('/')[links[k].split('/').length - 1]};
      let found = await puppeteerDb.collection('arrticles').find(query).toArray();
      if (found.length === articles.length) {
        console.log('phone found', query.phone);
      } else {
        for (let j in articles) {
          let text = await page.$eval('main article_ID_ div.description'.replace('_ID_', '[id="' + articles[j] + '"]'), text => text.innerText);
          let addedBy = await page.$eval('main article_ID_ div.added b span'.replace('_ID_', '[id="' + articles[j] + '"]'), added => added.innerText);
          let addedTime = await page.$eval('main article_ID_ div.added i span'.replace('_ID_', '[id="' + articles[j] + '"]'), time => time.innerText);
          let articleObj = {
            id: articles[j],
            smallDesc: descriptions,
            url: links[k],
            phone: links[k].split('/')[links[k].split('/').length - 1],
            altPhone: altNums,
            author: addedBy,
            time: addedTime,
            text: text,
          };
          let query = {id: articles[j]};
          let found = await puppeteerDb.collection('arrticles').findOne(query);
          if (found) {
            // await puppeteerDb.collection('arrticles').update(query, articleObj);
            console.log('found\t' + articleObj.phone + '\t' + articleObj.id);
          } else {
            await puppeteerDb.collection('arrticles').insert(articleObj);
            console.log('create\t' + articleObj.phone + '\t' + articleObj.id);
          }
        }
      }
    }
    console.log(artcilesObects);
  }
  page.close();
};
scrape();
