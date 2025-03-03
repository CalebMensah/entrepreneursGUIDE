const fs = require("fs");
const fetch = require("node-fetch");

const API_KEY = "745481b87ecc4f849fb7d7d3ae7c1fa0";
const NEWS_URL = `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${API_KEY}`;
const FILE_PATH = "./content/news.json"; // Save inside Hugo's content folder

async function fetchNews() {
    try {
        const response = await fetch(NEWS_URL);
        const data = await response.json();

        if (data.status === "ok") {
            fs.writeFileSync(FILE_PATH, JSON.stringify(data.articles, null, 2));
            console.log("News updated successfully!");
        } else {
            console.error("Failed to fetch news:", data);
        }
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

fetchNews();
