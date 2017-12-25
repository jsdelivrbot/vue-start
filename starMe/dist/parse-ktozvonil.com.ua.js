const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'parse-ktozvonil.com.ua.json';
let mutatedFile = 'parse-ktozvonil.com.ua.mut.json';

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  let mutations = {
    cyr: 'аеорсіуАВЕКНОРСТХМІ'.split(''),
    eng: 'aeopciyABEKHOPCTXMI'.split('')
  };
  let mutationsAll = {};
  await mutations.cyr.map((s, i) => mutationsAll[s] = mutations.eng[i]);
  await console.log(mutationsAll);

  await page.setViewport({width: 1600, height: 1200});

//1005
  let allComments = await jsonfile.readFileSync(file);
  // let allComments = []
  for (let i = 1; i <= 1; i++) {
    console.log('-------', i, '-------');
    await page.goto('http://kto-zvonil.com.ua/page-' + i);
    let items = await page.$$eval('.list-items .item', items => items.map(item => item.innerHTML));
    await items.map(item => {
      $ = cheerio.load(item);
      let comment = {
        phone: $('.title .number').text(),
        callType: $('.title .desc').text().replace(' | ', '').replace('- ', ''),
        text: $('.body').text(),
        reportTime: $('.info .date').text(),
        reporterName: $('.info .light').text().replace(' | ', '').replace('- ', ''),
        pageNumber: i
      };
      allComments.push(comment);
      return comment;
    });
    await jsonfile.writeFileSync(file, allComments, {spaces: 1});
  }

  allComments = await jsonfile.readFileSync(file);
  allComments = await allComments.sort(function (a, b) {
    return (a.phone - 0) - (b.phone - 0)
  });
  await jsonfile.writeFileSync(file, allComments, {spaces: 1});
  let allCommentsStr = (JSON.stringify(allComments)).split('');

  allCommentsStr = (allCommentsStr.map(s => mutationsAll[s] || s)).join('');


  allComments = JSON.parse(allCommentsStr);
  await jsonfile.writeFileSync(mutatedFile, allComments, {spaces: 1});

  await page.close();
  await browser.close();
};


scrape();
