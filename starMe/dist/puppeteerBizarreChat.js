const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';

let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});
  await page.goto('http://bizarre.kiev.ua/');
  let frames = await page.frames();
  let mainFrame = await frames.find(f => f.name() === 'main');
  await mainFrame.$eval('[name="name"]', inp => inp.click());
  await page.keyboard.type('-(. )( .)-');
  await mainFrame.$eval('[name="pass"]', inp => inp.click());
  await mainFrame.$eval('[name="pass"]', inp => inp.focus());
  await page.keyboard.type('-(. )( .)-');
  await mainFrame.$eval('[name="sx"][value="f"]', inp => inp.click());
  await mainFrame.$eval('[name="color"][value="H"]', inp => inp.click());
  await mainFrame.$eval('[name="room"][value="I+"]', inp => inp.click());
  await mainFrame.$eval('[name="room_I"]', inp => inp.click());
  await mainFrame.$eval('[type="submit"]', inp => inp.click());
  await page.waitFor(15000);


  // `<frameset `  - <table><tr>
  // `</frameset>` - </tr></table>
  // `<frame `     - <td><frame


  await page.$eval('html', bdy => {
    // bdy.innerHTML = bdy.innerHTML.replace(/frameset/gi,'div');
    // bdy.innerHTML = bdy.innerHTML.replace(/<frame /gi,'<iframe ');
  });

  // let frameSetsRoot = await page.$$eval('frameset frame', frameSets => frameSets);
  // console.log(frameSetsRoot);
  // let framesRoot = await page.$$eval('frame', frames => frames);
  // console.log(framesRoot);
  // await page.waitFor(5000);
  // page.close()
};


scrape();
