const puppeteer = require('puppeteer');

async function searchLaptopOnAmazon(laptopModel) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // Navigate to Amazon
    await page.goto('https://www.amazon.com/');
    
    // Type the laptop model into the search bar and submit
    await page.type('#twotabsearchtextbox', laptopModel);
    await page.click('input#nav-search-submit-button');
    
    // Wait for the results to load
    await page.waitForSelector('.s-main-slot');
    
    // Extract vendor names and prices
    const laptops = await page.evaluate(() => {
        const results = [];
        const items = document.querySelectorAll('.s-main-slot .s-result-item');
        
        items.forEach(item => {
            const name = item.querySelector('span.a-text-normal')?.textContent;
            const priceWhole = item.querySelector('span.a-price-whole')?.textContent;
            const priceFraction = item.querySelector('span.a-price-fraction')?.textContent;
            const vendor = item.querySelector('.a-row.a-size-base.a-color-secondary span.a-size-base.a-color-secondary')?.textContent;
            
            if (name && priceWhole && priceFraction && vendor) {
                results.push({
                    name,
                    price: `$${priceWhole}.${priceFraction}`,
                    vendor
                });
            }
        });

        return results;
    });
    
    // Log the laptops found
    console.log(laptops);
    
    await browser.close();
}

// Replace this with the laptop model you want to search
searchLaptopOnAmazon('Dell XPS 13');