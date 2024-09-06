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

    try {
        console.log("Navigating to Amazon...");
        await page.goto('https://www.amazon.in/', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#twotabsearchtextbox', { timeout: 10000 });

        console.log("Typing laptop model into the search bar...");
        await page.type('#twotabsearchtextbox', laptopModel, { delay: 100 });
        await page.click('input#nav-search-submit-button');
        await page.waitForSelector(".s-pagination-next");
        await page.click(".s-pagination-next");
        await page.waitForSelector(".s-pagination-next");
        console.log("Checking if navigation occurs...");
        // await page.waitForNavigation({ waitUntil: 'networkidle0' });

        console.log("Waiting for the results container...");
        // await page.waitForSelector('.s-main-slot', { timeout: 15000 });

        const title = await page.$$eval("h2 span.a-color-base", (nodes) =>
            nodes.map((n) => n.innerText)
          );
          
          // Gather price
          const price = await page.$$eval(
            "[data-component-type='s-search-result'] span.a-price[data-a-color='base'] span.a-offscreen",
            (nodes) => nodes.map((n) => n.innerText)
          );

          const amazonSearchArray = title.slice(0, 5).map((value, index) => {
            return {
              title: title[index],
              price: price[index],
            };
          });
          const jsonData = JSON.stringify(amazonSearchArray, null, 2);
          console.log(amazonSearchArray);
        //   await browser.close();

        // const firstResult = await page.evaluate(() => {
        //     const item = document.querySelector('.s-main-slot .s-result-item');
        //     if (!item) return null;

        //     const name = item.querySelector('span.a-text-normal')?.textContent;
        //     const priceWhole = item.querySelector('span.a-price-whole')?.textContent;
        //     const priceFraction = item.querySelector('span.a-price-fraction')?.textContent;
        //     const vendor = item.querySelector('.a-row.a-size-base.a-color-secondary span.a-size-base')?.textContent;

        //     if (name && priceWhole && priceFraction) {
        //         return {
        //             name: name.trim(),
        //             price: `$${priceWhole}.${priceFraction}`,
        //             vendor: vendor ? vendor.trim() : 'Unknown Vendor'
        //         };
        //     }
        //     return null;
        // });

        console.log("Closing browser...");
        await browser.close();

        

        return jsonData;
    } catch (error) {
        console.error("Error scraping Amazon:", error.message);
        await browser.close();
        throw error;
    }
}

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});