const express = require('express');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.static(__dirname + '/screenshots'));

const randomstring = require("randomstring");

app.get("/", async (request, response) => {
    const random = randomstring.generate({
        length: 7,
        charset: 'alphabetic'
    });
    try {
        const width = parseInt(request.query.width) || 1440;
        const height = parseInt(request.query.height) || 900;
        const browser = await puppeteer.launch({
            headless: false,
        });
        const dir = __dirname + '/screenshots';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, 0744);
        }
        const page = await browser.newPage();

        await page.setViewport({
            width: width,
            height: height
        })

        const type = request.query.type
        const url = request.query.url
        await page.goto(url, {
            waitUntil: 'load',
            // Remove the timeout
            timeout: 0

        });
        const title = await page.title()
        const path = `${dir}/${title}_${random}.${type}` //type : jpeg or png

        const image = await page.screenshot({
            path: path

        });
        await page.close();
        await browser.close();
        const file = path; 
        response.download(file);
        fs.remove(file, err => {
            if (err) return console.error(err)
            console.log('file deleted!')
        })
    } catch (error) {
        console.log(error);
    }
});
 // to do  pdf screenshot 

const listener = app.listen(3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});