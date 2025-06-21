const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const url = 'https://www.amazon.in/Mivi-Earbuds-Playtime-Wireless-Assistant-Black/dp/B0B2PFLS3M/ref=sr_1_1_sspa?crid=2KRMDYO5ZQ3VI&keywords=mivi+duopods&qid=1658132803&sprefix=mivi+duopods%2Caps%2C241&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzOFVQUU9DSklEOEdEJmVuY3J5cHRlZElkPUEwMTYyMjE2M0w5UzZCQkVRWFVOVCZlbmNyeXB0ZWRBZElkPUEwNTYwMTg1MTkzV09JQkRaWDk0ViZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=';
const targetPrice = 2000;
let scraper = async url => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const result = await page.evaluate(() => {
    let title = document.querySelector('#productTitle').innerText;

    let priceStr = document.querySelector('.a-offscreen').innerText;
    let res = priceStr.replace(/₹/g, "");
    res = res.replace(/,/g, "");

    let priceInt = parseInt(res);
    return {

      title,
      priceInt
    };
  });
  browser.close();
  return result;
};




function sendEmail(result) {
  const mailOptions = {
    from: 'cse.20201025@gmail.com',
    to: 'cse.20201050@gmail.com' ,
    subject: `AMAZON PRICE TRACK - ${result.title} - PRICE: ${result.priceInt}`,
    html: `<p>Hey Anuradha,Greetings from Rajat and Gaurav, your selected product is within your specified Target Price. Don't wait a second, hurry!!!!! before it goes out of stock.
    Go and buy it now <a href="${url}">HERE</a></p>`
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'cse.20201025@gmail.com',
      pass: 'rmzkiyapooirorsq'
    }
  });
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log('Email Sent Successfully');
  });

}
function init() {
  scraper(url)
    .then(result => {
      console.log(result)
      let currentPrice = result.priceInt;
      if (currentPrice < targetPrice) {
        sendEmail(result);
      }
    })
    .catch(err => {
      console.log('Fatal Error', err);
    });
}


init();



