const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let pages = 'parse-phonenumbers.to.array.json';
let usedPages = 'parse-phonenumbers.to.used.array.json';
let entitiesFile = 'parse-phonenumbers.to.entities.json';
this.cheerio = cheerio;
let self = this;

let scrape = async () => {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});

  let items = await jsonfile.readFileSync(pages);

  let usedItems = await jsonfile.readFileSync(usedPages);
  console.log('before filter', items.length);
  items = items.filter(item => usedItems.indexOf(item) === -1);
  console.log('after filter', items.length);
  /// div.user_heading_info h1[itemprop="name"] - name
  /// form-group
  ///   control-label
  ///   form-control-static

  ///

  let entities = await jsonfile.readFileSync(entitiesFile);

  for (let ii = 0; ii < 2000; ii++) {
    try {
      await page.goto(items[ii]);
      // await page.goto('https://phonenumber.to/phone/79096288198');
      let entity = {};
      entity.comments = {};
      entity.name = await page.$eval('div.user_heading_info h1[itemprop="name"]', element => element.innerText);
      entity.userImage = await page.$eval('#user-image', element => element.src);
      let fields = await page.$$eval(
        'div.user_content div.user_form div.form-group',
        elements => elements.map(element => element.innerText.replace(/\n\n$/g, '').split(':')));
      await fields.map(item => {
        entity[item[0]] = item[1].replace(/^\n/, '')
      });
      await page.$$eval(
        '#comments .media',
        comments => {
          comments.map((comment, i) => {
              comment.innerHTML = comment.innerHTML.replace('<i class="fa fa-user"></i>', 'reporter:');
              comment.innerHTML = comment.innerHTML.replace('<i class="fa fa-clock-o"></i>', ';time:');
            }
          )
        }
      );
      let comIds = await page.$$eval('#comments .media', comments => comments.map(comment => comment.id));
      for (let i = 0; i < comIds.length; i++) {
        let id = comIds[i];
        entity.comments[id] = {};
        entity.comments[id]['text'] = await page.$eval('[id="' + id + '"]' + ' [itemprop="commentText"]', commentText => commentText.innerText);
        let commentInfo = await page.$eval('[id="' + id + '"]' + ' [class="comment_info"]', commentText => commentText.innerText);
        let commentInfoSplitted = commentInfo.split(';');
        let commentInfoSplittedFields = [];
        for (let j = 0; j < commentInfoSplitted.length; j++) {
          commentInfoSplittedFields.push(commentInfoSplitted[j].replace(':', '|').split('|'))
        }

        for (let k = 0; k < commentInfoSplittedFields.length; k++) {
          entity.comments[id][commentInfoSplittedFields[k][0]] = commentInfoSplittedFields[k][1];
        }
      }
      // await console.log(entity);
      entities.push(entity);
      usedItems.push(items[ii]);

      entities = await entities.filter((v, i, a) => a.indexOf(v) === i);
      await jsonfile.writeFileSync(entitiesFile, entities, {spaces: 1});
      await jsonfile.writeFileSync(usedPages,usedItems , {spaces: 1});

    } catch (err) {
      console.log(err,items[ii]);
    }

  }


  // comments
  // comments '<i class="fa fa-clock-o"></i>' , ';time:'

  // #comments .media


  console.log('THE END', items.length);

  await page.close();
  await browser.close();
};


scrape();
