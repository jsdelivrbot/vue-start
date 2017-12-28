const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let pages = 'parse-phonenumbers.to.array.json';


let scrape = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});

  let items = await jsonfile.readFileSync(pages);

  let pagesNum = 0;
  let topPages = true;
  let yandexPages = 900;
  let yandexStartPage = 0;


  for (let i = 1; i <= pagesNum; i++) {
    await page.goto('http://phonenumber.to/comments/' + i);
    (await page.$$eval('div[class="comment_phone"] a[itemprop="discusses"]', items => items.map(item => item.href))).map(href => items.push(href))
  }

  for (let i = 1; i <= pagesNum; i++) {
    await page.goto('http://phonenumber.to/stats/' + i);
    (await page.$$eval('div[class="comment_phone"] a[itemprop="discusses"]', items => items.map(item => item.href))).map(href => items.push(href))
  }

  if (topPages) {
    await page.goto('http://phonenumber.to/stats/');
    (await page.$$eval('div.panel div.media div.sidebar-body a', items => items.map(item => item.href))).map(href => items.push(href));
    await page.goto('http://phonenumber.to/comments/');
    (await page.$$eval('div.panel div.media div.sidebar-body a', items => items.map(item => item.href))).map(href => items.push(href));
    await page.goto('http://phonenumber.to/');
    (await page.$$eval('div.media div.media-body a', items => items.map(item => item.href))).map(href => items.push(href));
  }

  console.log('main', items.length);


  /// div.user_heading_info h1[itemprop="name"] - name

  /// form-group
  ///   control-label
  ///   form-control-static


  ///


  let urls = [
    'https://yandex.ru/search/?text=host:phonenumber.to исаев сергей',
  ];
  let yandexBrowserSearch = async (url, page) => {
    return new Promise(async function (resolve, reject) {
      let nextState = true;
      await page.goto(url);
      (await page.$$eval('a.link_theme_normal', items => items.map(item => item.href))).map(href => items.push(href));

      for (let i = 0; i <= yandexPages && nextState; i++) {
        (await page.$$eval('a.link_theme_normal', items => items.map(item => item.href))).map(href => items.push(href));
        try {
          await page.$eval("a.pager__item_kind_next", item => item.click());
        } catch (error) {
          nextState = false
        }
        await page.waitFor(3000);
        console.log(i, items.length);
      }
      console.log(url, items.length, items);
      resolve();
    });
  };

  for (let i = 0; i < urls.length; i++) {
    await yandexBrowserSearch(urls[i], page)
  }


  urls = [
    'https://phonenumber.to/search?text=исаев сергей',
  ];
  let internalPhonenumberSearch = async (url, page) => {
    return new Promise(async function (resolve, reject) {
      let nextState = true;
      await page.goto(url);
      (await page.$$eval('[class="search_heading"] a', items => items.map(item => item.href))).map(href => items.push(href));
      yandexPages = 500;
      for (let i = 0; i <= yandexPages && nextState; i++) {
        (await page.$$eval('[class="search_heading"] a', items => items.map(item => item.href))).map(href => items.push(href));
        try {
          await page.$$eval('[class="pagination"] li a', items => {
            if (items[items.length - 1].innerText.includes('Next')) {
              items[items.length - 1].click()
            } else {
              nextState = false;
              i = yandexPages + 1;
            }
          });
        } catch (error) {
          nextState = false
        }
        await page.waitFor(3000);
        console.log(i, items.length);
      }
      console.log(url, items.length, items);
      resolve();
    });
  };

  for (let i = 0; i < urls.length; i++) {
    await internalPhonenumberSearch(urls[i], page)
  }


  ///https://nova.rambler.ru/search?query=site%3Aphonenumber.to&sort=1&pagelen=20&adult=none&lang=ru


  items = await items.filter((v, i, a) => a.indexOf(v) === i);
  items = await items.filter((v, i, a) => v.includes('//phonenumber.to'));
  items = await items.filter((v, i, a) => v.includes('/phone/'));


  console.log('THE END', items.length);

  await jsonfile.writeFileSync(pages, items, {spaces: 1});
  await page.close();
  await browser.close();
};


scrape();
