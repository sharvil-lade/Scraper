const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Body parser to handle form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the form page
app.get('/', (req, res) => {
    res.render('index');
});

// Handle form submission
app.post('/search', async (req, res) => {
    const laptopModel = req.body.model;
    // console.log(laptopModel);
    try {
        const searchResult = await searchLaptopOnAmazon(laptopModel);
        
        // Render the results page and pass the data to it
        res.render('results', { model: laptopModel, result: searchResult });
    } catch (error) {
        res.send('Error: ' + error.message);
    }
});

// Function to search for a laptop model on Amazon and get the first result
async function searchLaptopOnAmazon(laptopModel) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.amazon.in/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('#twotabsearchtextbox', { timeout: 30000 });
    await page.type('#twotabsearchtextbox', laptopModel, { delay: 100 });
    await page.click('input#nav-search-submit-button');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

    const productLinkSelector = `.s-main-slot [data-index="3"] h2 a`;
    await page.waitForSelector(productLinkSelector, { timeout: 30000 });
    await page.click(productLinkSelector);
await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 90000 }); // Wait until no network activity


    const nam = document.querySelector('#productTitle')?.textContent?.trim();
    const priceElement = document.querySelector('.a-price-whole');
    const pric = priceElement ? priceElement.textContent.trim() : 'N/A';
    const vendorInf = document.querySelector('a[id^="sellerProfileTrigger"]')?.textContent?.trim();

  

    await browser.close();
    return {name:nam,price:pric,vendor:vendorInf};
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});