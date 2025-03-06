const fs = require("fs");
const axios = require("axios");
const path = require("path");

const NEWS_API_KEY = "745481b87ecc4f849fb7d7d3ae7c1fa0";  // Replace with your API key
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?category=business&country=us&apiKey=${NEWS_API_KEY}`;
const NEWS_FOLDER = "content/news";
const NEWS_JSON = "static/news.json"; // Used for API-like data source
const MAX_ARTICLES = 30;  // Show latest 30 articles only

async function fetchNews() {
    try {
        console.log("Fetching latest news...");
        const response = await axios.get(NEWS_API_URL);
        let newsData = response.data.articles.slice(0, MAX_ARTICLES); // Keep only 30

        // Ensure the folder exists
        if (!fs.existsSync(NEWS_FOLDER)) {
            fs.mkdirSync(NEWS_FOLDER, { recursive: true });
        }

        // Clear old markdown files
        fs.readdirSync(NEWS_FOLDER).forEach(file => fs.unlinkSync(path.join(NEWS_FOLDER, file)));

        // Create .md files for each news article
        newsData.forEach((article, index) => {
            const filename = `${NEWS_FOLDER}/${index + 1}.md`; // Example: `news/1.md`
            const markdownContent = `---
title: "${article.title.replace(/"/g, "'")}"
date: "${new Date().toISOString()}"
author: "${article.author || 'Unknown'}"
image: "${article.urlToImage || '/default-image.jpg'}"
source: "${article.url}"
description: "${article.description || 'No description available.'}"
---
${article.content || 'Content not available.'}
            `;
            fs.writeFileSync(filename, markdownContent);
        });

        // Save JSON for API-like access
        fs.writeFileSync(NEWS_JSON, JSON.stringify(newsData, null, 2));
        console.log("✅ News updated successfully!");

    } catch (error) {
        console.error("❌ Error fetching news:", error);
    }
}

// Run the script once
fetchNews();
