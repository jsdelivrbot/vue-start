const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let arrayFile = 'parse-orbita.co.il.array.json';

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1920});
  await page.goto('http://doska.orbita.co.il/nadlan/for_rent/?place=city10&roomf=0&roomt=0&costf=&costt=&cur=30');

  let internalPhonenumberSearch = async (url, page) => {
    return new Promise(async function (resolve, reject) {
        let items = await jsonfile.readFileSync(arrayFile);
        let nextState = true;
        await page.goto(url);
        let max = 500;
        for (let i = 0; i <= max && nextState; i++) {
          (await page.$$eval('div.message-id a', items => items.map(item => item.href))).map(href => items.push(href));
          try {
            await page.$eval('[class="pages"] [title="Следующая"]', item => item.click())
          }
          catch (error) {
            nextState = false;
            console.log(error);
          }
          await page.waitFor(1500);
          console.log(i, items.length);
        }

        items = await items.filter((v, i, a) => a.indexOf(v) === i);
        await jsonfile.writeFileSync(arrayFile, items, {spaces: 1});
        resolve(items);
      }
    );
  };
  let items = await internalPhonenumberSearch('http://doska.orbita.co.il/nadlan/for_rent/?place=city10&roomf=0&roomt=0&costf=&costt=&cur=30', page);
  await console.log(items);
  await page.close();
  await browser.close();

};


scrape();
