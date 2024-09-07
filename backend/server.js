const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

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

    items.forEach((item) => {
      const title = item.querySelector('h2 > a > span')?.innerText || 'N/A';
      const price = item.querySelector('.a-price-whole')?.innerText || 'N/A';
      const link = item.querySelector('h2 > a')?.href || 'N/A';
      if (title && price) {
        products.push({
          title,
          price: `₹${price}`,
          link: `https://www.amazon.in${link}`,
        });
      }
    });

    return products;
  });

  await browser.close();
  return scrapedData;
}

app.post('/scrape', async (req, res) => {
  const { searchTerm } = req.body;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const data = await scrapeAmazon(searchTerm);
    res.json(data);
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    res.status(500).json({ error: 'Failed to scrape Amazon' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
