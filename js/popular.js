let popularMovies = [];
let currentPage = 0;
let totalPages;
let isFetching = false;

/**Main function
 * 
 */
function popular() {
    fetchIData();
}
/**
 * Fetch new data
 * @param {void}void
 * @returns {void} void
 */
const fetchIData = async () => {
    isFetching = true;
    popularMovies = [];
    currentPage = currentPage + 1;
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&page=${currentPage}`);
    const data = await response.json();
    totalPages = data.total_pages;
    if (currentPage <= totalPages) {
        parsePopularData(data);
        isFetching = false;
    }
}
/**Take the new data and convert it to a meaningful data
 *@param {Object}data
 *@returns {void}
 */
function parsePopularData(data) {
    totalPages = data.total_pages;
    data.results.map(movie => {
        popularMovies.push(movie);
    });
    drawPopular();
}
/**Render the data into the html page
 * @param {void}void
 * @returns {void}
 */
function drawPopular() {
    const container = document.querySelector('.contant-warpper');
    let html = ``;
    const path = window.location.pathname;
    const imgurl = 'https://image.tmdb.org/t/p/original/';
    popularMovies.forEach(movie => {
        const classVote = checkVote(movie.vote_average);
        let moviePoster = movie.poster_path;
        const error = `../assets/error-404-message.png`;
        if (movie.poster_path == null) moviePoster = error;
        else moviePoster = imgurl + moviePoster;
        html = `  <div class="movie-card">
        <div class="movie-img-container">
        <img src="${moviePoster}" alt="${movie.title}" title="${movie.title}" class="movie-img">
        <span class="rate ${classVote}">${convertToFloat(movie.vote_average)}</span>
        <div class="overlay">
            <a href="${path.substring(0, path.lastIndexOf('/'))}/pages/movie.html?id=${movie.id}" class="img-play-icon" title="${movie.title}">
                <i class="fa fa-play"></i>
            </a>
        </div>
        </div>
        <a class="movie-name" href="${path.substring(0, path.lastIndexOf('/'))}/pages/movie.html?id=${movie.id}">${movie.title}</a>
        <span class="date">${movie.release_date}</span>
      </div>`
        container.innerHTML += html;
    })

}
/**
 * Take the voat number and make it a float number for better styling
 * @param {number} rate 
 * @returns {string} rate_float
 */
function convertToFloat(number) {
    return Number.isInteger(number) ? (number + ".0") : (number.toString());
}
/**
 * Handle errors from fetching data
 * @param {number} errortype 
 */
function showError(error) {
    if (error == 401) {
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
//Search listener
const searchButton = document.querySelector('.icon');
const searchInput = document.getElementById('movie-search');
searchButton.addEventListener('click', () => {
    if (searchInput.value != '')
        window.open(`pages/search.html?search=${searchInput.value}`, '_self');
    else
        alert("Search bar is empty!\nKindly put something in it.")
})
searchInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchButton.click();
    }
});