const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let file = 'data.json';

let getFullPageScreenshot = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 1280, height: 1024});
  await page.goto('https://lenta.ru/');
  await page.waitFor(5000);
  await page.screenshot({path: 'bdy1.png', fullPage: true});
  await page.$eval('body', bdy => {
    bdy.innerHTML = `<style type="text/css">body{overflow:hidden;}</style><div id="bdy0">` + bdy.innerHTML + '</div>';
  });
  let bodyDiv = await page.$('div#bdy0');
  await bodyDiv.screenshot({path: 'bdy0.png'});

};


getFullPageScreenshot();
