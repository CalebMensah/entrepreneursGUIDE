const categoryFilter = document.getElementById('category-filter')
const newsContainer = document.getElementById('news-container')
const loadingIndicator = document.getElementById('loading-indicator')

// default category
let currentCategory = 'business'

// initialize the news page
window.addEventListener('DOMContentLoaded', () => {
    // show loading indicator
    loadingIndicator.style.display = 'block';
    newsContainer.innerHTML = '' // clear container

    // fetch news for default category
    fetchNews(currentCategory);

    // handle category change
    categoryFilter.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        currentCategory = selectedCategory;

        // show loading indicator 
        loadingIndicator.style.display = 'block';
        newsContainer.innerHTML = '';

        // fetch news for selected category
        fetchNews(selectedCategory)
    })
})

// function to fetch news from news API
async function fetchNews(category) {
    const apiKey = '745481b87ecc4f849fb7d7dd3ae7c1fao'
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=10&apiKey=${apiKey};`

    try {
        const res = await fetch(url);
        if(!res.ok) {
            throw new Error(`API Error: ${res.status} - ${res.statusText}`)
        }

        const data = await res.json();
        if(data.articles && data.articles.length > 0) {
            renderNews(data.articles);
        } else{
            newsContainer.innerHTML = '<p>No news article found for this category.</p>'
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>An error occurred whiles fetching news. Please try again later</p>'
    } finally {
        // hide loading indicator
        loadingIndicator.style.display = 'none'
    }
}

// function to render news
function renderNews(articles) {
    newsContainer.innerHTML = '';

    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.innerHTML = `
        <a href ="${article.url}" target"_blank">
        <img src=${article.urlToImage} alt="${article.title}" class="news-image">
        <h2>${article.title}</h2>
        <p>${article.description || 'No description available'}</p>
        <small>Source: ${article.source.name} | Published : ${new Date(article.publishedAt).toLocaleDateString()}</small>
        `;
        newsContainer.appendChild(card)
    });
}