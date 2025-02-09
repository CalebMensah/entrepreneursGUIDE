// Initialize category filter
document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.addEventListener('change', () => {
        const selectedCategory = categoryFilter.value;
        fetchNewsByCategory(selectedCategory);
    });

    // Default category is "business"
    fetchNewsByCategory('business');
});

// Function to fetch news by category
function fetchNewsByCategory(category) {
    const apiKey = '745481b87ecc4f849fb7d7d3ae7c1fa0'; // Replace with your actual API key
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=gh&pageSize=10&apiKey=${apiKey}`;
    const cacheKey = `cachedNews-${category}`;

    const cachedNews = getFromLocalStorage(cacheKey);

    if (cachedNews && isCacheValid(cachedNews)) {
        // Load from cache
        renderNews(cachedNews.articles);
    } else {
        // Fetch from API
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.articles && data.articles.length > 0) {
                    // Save to cache
                    saveToLocalStorage(cacheKey, data);

                    // Render news
                    renderNews(data.articles);
                } else {
                    document.getElementById('news-container').innerHTML = '<p>No news articles found for this category.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                document.getElementById('news-container').innerHTML = '<p>An error occurred while fetching news. Please try again later.</p>';
            });
    }
}

// Function to save data to localStorage with category-specific keys
function saveToLocalStorage(key, data) {
    const timestamp = Date.now();
    const cachedData = { articles: data.articles, timestamp };
    localStorage.setItem(key, JSON.stringify(cachedData));
}

// Function to retrieve data from localStorage
function getFromLocalStorage(key) {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
}

// Function to check if cache is valid
function isCacheValid(cachedData) {
    const currentTime = Date.now();
    const expirationTime = cachedData.timestamp + CACHE_DURATION * 60 * 1000; // Convert minutes to milliseconds
    return currentTime < expirationTime;
}

// Function to render news articles
function renderNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear container

    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
            <a href="${article.url}" target="_blank">
                <img src="${article.urlToImage || '/images/default-news.jpg'}" alt="${article.title}" class="news-image">
                <h2>${article.title}</h2>
                <p>${article.description || 'No description available.'}</p>
                <small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleDateString()}</small>
            </a>
        `;
        newsContainer.appendChild(card);
    });
}
