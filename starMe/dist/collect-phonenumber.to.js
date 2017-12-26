const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const jsonfile = require('jsonfile');
let pages = 'parse-phonenumbers.to.array.json';
this.cheerio = cheerio;
let self = this;

let scrape = async () => {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({width: 800, height: 600});

  let items = await jsonfile.readFileSync(pages);

  /// div.user_heading_info h1[itemprop="name"] - name
  /// form-group
  ///   control-label
  ///   form-control-static


  ///


  // await page.goto(items[70]);
  await page.goto('https://phonenumber.to/phone/79096288198');
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
  let commentIds = await page.$$eval('#comments .media', comments => comments.map(comment => comment.id));

  await commentIds.map(async id => {
    entity.comments[id] = {};
    let commentText = await page.$eval('[id="' + id + '"]' + ' [itemprop="commentText"]', commentText => commentText.innerText);
    let commentInfo = await page.$eval('[id="' + id + '"]' + ' [class="comment_info"]', commentText => commentText.innerText);
    commentInfo = await commentInfo.split(';');
    let commnentInfoFields = await commentInfo
      .map(commentInfoField => commentInfoField.replace(':', '|').split('|'))
      .map(commentInfoField => {
        entity.comments[id][commentInfoField[0]] = commentInfoField[1]
        console.log(entity);
      });
  });

  console.log(entity);

  // comments
  // comments '<i class="fa fa-clock-o"></i>' , ';time:'

  // #comments .media


  console.log('THE END', items.length);

  // await page.close();
  // await browser.close();
};


scrape();
