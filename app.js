const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))

app.get('/', (req,res)=>{
    res.render('index')
})

app.get("/pdf", async (req, res) => {
    const url = await req.query.url;

    const browser = await puppeteer.launch({
        headless: true
    });

    const webPage = await browser.newPage();

    await webPage.goto(url, {
        waitUntil: "networkidle0"
    });
    
    const pdf = await webPage.pdf({
        printBackground: true,
        format: "A4",
        margin: {
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px"
        }
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
})

app.listen(3001, () => {
    console.log("Server started");
});