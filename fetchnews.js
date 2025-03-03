const fs = require('fs');
const axios = require('axios');

const NEWS_API_KEY = "745481b87ecc4f849fb7d7d3ae7c1fa0";  // Replace with your API key745481b87ecc4f849fb7d7d3ae7c1fa0
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${NEWS_API_KEY}`;

async function fetchNews() {
    try {
        const response = await axios.get(NEWS_API_URL);
        const newsData = response.data.articles;

        fs.writeFileSync("static/news.json", JSON.stringify(newsData, null, 2));
        console.log("✅ News data updated!");
    } catch (error) {
        console.error("❌ Error fetching news:", error);
    }
}

fetchNews();
