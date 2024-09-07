// const express = require('express');
// const puppeteer = require('puppeteer');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// const port = process.env.PORT || 5000; // Use environment variable if available

// app.use(cors());
// app.use(bodyParser.json());

// async function scrapeAmazon(searchTerm) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm)}`;
//   await page.goto(url, { waitUntil: 'load', timeout: 0 });

//   const scrapedData = await page.evaluate(() => {
//     const products = [];
//     const items = document.querySelectorAll('.s-main-slot .s-result-item');

//     items.forEach(item => {
//       const title = item.querySelector('h2 > a > span')?.innerText;
//       const price = item.querySelector('.a-price-whole')?.innerText;
//       const link = item.querySelector('h2 > a')?.href;
//       if (title && price && link) {
//         products.push({
//           title,
//           price: `₹${price}`, // Corrected price formatting
//           link: `https://www.amazon.in${link}`,
//           source: 'Amazon'
//         });
//       }
//     });

//     return products;
//   });

//   await browser.close();
//   return scrapedData.slice(0, 10); // No need to filter for 'N/A' since the condition checks for undefined
// }

// async function scrapeFlipkart(searchTerm) {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchTerm)}`;
//   await page.goto(url, { waitUntil: 'load', timeout: 0 });

//   const scrapedData = await page.evaluate(() => {
//     const products = [];
//     const items = document.querySelectorAll('._1AtVbE');

//     items.forEach(item => {
//       const title = item.querySelector('._4rR01T')?.innerText;
//       const price = item.querySelector('._30jeq3')?.innerText;
//       const link = item.querySelector('._1fQZEK')?.href;
//       if (title && price && link) {
//         products.push({
//           title,
//           price,
//           link: `https://www.flipkart.com${link}`,
//           source: 'Flipkart'
//         });
//       }
//     });

//     return products;
//   });

//   await browser.close();
//   return scrapedData.slice(0, 10); // No need to filter for 'N/A'
// }

// app.post('/scrape', async (req, res) => {
//   const { searchTerm } = req.body;
//   if (!searchTerm) {
//     return res.status(400).json({ error: 'Search term is required' });
//   }

//   try {
//     const amazonResults = await scrapeAmazon(searchTerm);
//     const flipkartResults = await scrapeFlipkart(searchTerm);
//     const combinedResults = amazonResults.concat(flipkartResults).slice(0, 10);  // Combine and limit to first 10 products overall
//     res.json(combinedResults);
//   } catch (error) {
//     console.error('Error scraping:', error);
//     res.status(500).json({ error: 'Failed to scrape' });
//   }
// });

// app.post('/scrape1', async (req, res) => {
//   const { searchTerm } = req.body;
//   if (!searchTerm) {
//     return res.status(400).json({ error: 'Search term is required' });
//   }

//   try {
//     const amazonResults = await scrapeAmazon(searchTerm);
//     const flipkartResults = await scrapeFlipkart(searchTerm);
//     const combinedResults = amazonResults.concat(flipkartResults).slice(0, 10);  // Combine and limit to first 10 products overall
//     res.json(combinedResults);
//   } catch (error) {
//     console.error('Error scraping:', error);
//     res.status(500).json({ error: 'Failed to scrape' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000; // Use environment variable if available

app.use(cors());
app.use(bodyParser.json());

async function scrapeAmazon(searchTerm) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchTerm)}`;
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  const scrapedData = await page.evaluate(() => {
    const products = [];
    const items = document.querySelectorAll('.s-main-slot .s-result-item');
    const currentDate = new Date().toLocaleString(); // Timestamp of when the price is updated

    items.forEach(item => {
      const title = item.querySelector('h2 > a > span')?.innerText;
      const price = item.querySelector('.a-price-whole')?.innerText;
      const link = item.querySelector('h2 > a')?.href;
      if (title && price && link) {
        products.push({
          title,
          price: `₹${price}`, // Corrected price formatting
          link: `https://www.amazon.in${link}`,
          source: 'Amazon',
          lastUpdated: currentDate // Add last updated timestamp
        });
      }
    });

    return products;
  });

  await browser.close();
  return scrapedData.slice(0, 10); // Limit to first 10 products
}

async function scrapeFlipkart(searchTerm) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchTerm)}`;
  await page.goto(url, { waitUntil: 'load', timeout: 0 });

  const scrapedData = await page.evaluate(() => {
    const products = [];
    const items = document.querySelectorAll('._1AtVbE');
    const currentDate = new Date().toLocaleString(); // Timestamp for price update

    items.forEach(item => {
      const title = item.querySelector('._4rR01T')?.innerText;
      const price = item.querySelector('._30jeq3')?.innerText;
      const link = item.querySelector('._1fQZEK')?.href;
      if (title && price && link) {
        products.push({
          title,
          price,
          link: `https://www.flipkart.com${link}`,
          source: 'Flipkart',
          lastUpdated: currentDate // Add last updated timestamp
        });
      }
    });

    return products;
  });

  await browser.close();
  return scrapedData.slice(0, 10); // Limit to first 10 products
}

app.post('/scrape', async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const amazonResults = await scrapeAmazon(searchTerm);
    const flipkartResults = await scrapeFlipkart(searchTerm);
    const combinedResults = amazonResults.concat(flipkartResults).slice(0, 10);  // Combine and limit to first 10 products overall
    res.json(combinedResults);
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ error: 'Failed to scrape' });
  }
});

app.post('/scrape1', async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const amazonResults = await scrapeAmazon(searchTerm);
    const flipkartResults = await scrapeFlipkart(searchTerm);
    const combinedResults = amazonResults.concat(flipkartResults).slice(0, 10);  // Combine and limit to first 10 products overall
    res.json(combinedResults);
  } catch (error) {
    console.error('Error scraping:', error);
    res.status(500).json({ error: 'Failed to scrape' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
