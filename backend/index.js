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

    // Instead of waiting for a hard-coded timeout, use networkidle0 to wait for the page to stabilize.
    try {
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
    } catch (error) {
        console.log("Navigation to product page took too long, but proceeding with data extraction.");
    }

    const productDetails = await page.evaluate(() => {
        const name = document.querySelector('.a-size-medium.a-color-base.a-text-normal')?.textContent?.trim();
        // const vendor = document.querySelector('#sellerProfileTriggerId')?.textContent?.trim();
        const vendor='yo';
        const price = document.querySelector('.a-price-whole')?.textContent?.trim();
        return { name, vendor, price };
    });

    // const productDetails=async ()=>{
        // const name = await page.$eval('#productTitle', (element) => element.textContent.trim());
        // const vendor = await page.$('.a-price-whole');
        // const price  =productPriceElement ? await page.evaluate(element => element.textContent.trim(), productPriceElement) : 'N/A';
        // return { name, vendor, price };
    // }
    
    await browser.close();
    return productDetails;
    // return { name, vendor, price };
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});