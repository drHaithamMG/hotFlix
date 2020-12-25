//Global variables
let searchContent;
let searchMovies = [];
let currentPage = 1;
let totalPages;
let isFetching = false;
const searchWarpper = document.querySelector('.search-warpper');
//page load listener
window.addEventListener('load', (event) => {
    searchContent = getParameterByName('search');
    queryForSearchContent(searchContent);
});
/**
 * Get movie ID from the url
 * @param {string} parameter_name (id) 
 * @param {string} url query
 * @returns {number} movie id 
 */
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function queryForSearchContent(searchContent) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&query=${searchContent}&include_adult=false`)
        .then(queryRespond => queryRespond.json())
        .then(queryResult => analysingResults(queryResult));
}

function analysingResults(queryResult) {
    if (queryResult.total_pages > 0) {
        totalPages = queryResult.total_pages;
        queryResult.results.map(queryResult => {
            searchMovies.push(queryResult);
        });
        drawMovies();
    } else {
        searchWarpper.innerHTML = `
        <span class="search-title">Search For ${searchContent}</span>
        <span class="search-failer">Unfortunately, ${searchContent} is not found.
        Try to be more specific or pick another keyword /movie title</span>
        `;
    }
}

function drawMovies() {
    searchWarpper.innerHTML = `
        <span class="search-title">Search For ${searchContent}</span>
        <div class="contant-warpper"></div>
        `
    const container = document.querySelector('.contant-warpper');
    let html = ``;
    const imgurl = 'https://image.tmdb.org/t/p/original/';
    searchMovies.forEach(movie => {
        const classVote = checkVote(movie.vote_average);
        html = `  <div class="movie-card">
        <div class="movie-img-container">
        <img src="${imgurl + movie.poster_path}" alt="${movie.title}" title="${movie.title}" class="movie-img">
        <span class="rate ${classVote}">${convertToFloat(movie.vote_average)}</span>
        <div class="overlay">
            <a href="/pages/movie.html?id=${movie.id}" class="img-play-icon" title="${movie.title}">
                <i class="fa fa-play"></i>
            </a>
        </div>
        </div>
        <a class="movie-name" href="/pages/movie.html?id=${movie.id}">${movie.title}</a>
        <span class="date">${movie.release_date}</span>
      </div>`
        container.innerHTML += html;
    })
}

function convertToFloat(number) {
    return Number.isInteger(number) ? (number + ".0") : (number.toString());
}

function showError(error) {
    if (error == 401 || error == 400) {
        console.log('URL is not found');
    }
}
/** Check the vote value 
 * @param {number}average_vote
 * @returns {string} class name
 */
function checkVote(averageVote) {
    return (averageVote > 7) ? 'rate-high' : 'rate-low';
}
const fetchIData = async() => {
    isFetching = true;
    popularMovies = [];
    currentPage = currentPage + 1;
    const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&query=${searchContent}&page=${currentPage}&include_adult=false`);
    const data = await response.json();
    totalPages = data.total_pages;
    if (currentPage <= totalPages) {
        analysingResults(data);
        isFetching = false;
    }
}

//scroll listener
function getDocHeight() {
    let D = document;
    return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight)
}
window.addEventListener("scroll", async() => {
    // Do not run if currently fetching
    if (isFetching) return;
    let winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
    let docheight = getDocHeight()
    let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    let trackLength = docheight - winheight
    let pctScrolled = Math.floor(scrollTop / trackLength * 100) // gets percentage scrolled (ie: 80 or NaN if tracklength == 0)
    if (pctScrolled > 90) {
        await fetchIData();
    }
});
//Search listener
const searchButton = document.querySelector('.icon');
const searchInput = document.getElementById('movie-search');
searchButton.addEventListener('click', () => {
    if (searchInput.value != '')
        window.open(`search.html?search=${searchInput.value}`, '_self');
    else
        alert("Search field is empty!\nKindly enter something")
})
searchInput.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchButton.click();
    }
});