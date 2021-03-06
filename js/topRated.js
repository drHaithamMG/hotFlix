/**
 * main function to build top rated movies
 * @param {void}  
 */
const topRatedMovies = [];

function topRated() {
    fetchData();
}
/**FetchData function
 * Fetch Related Movies from themoviedb.org
 * @param {void}
 * @returns {void}
 */
function fetchData() {
    fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&page=1')
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => parseData(data));
}
/**
 * Parse data to meaningful structure 
 * @param {Object} data fetched data from themoviedb.org
 * @returns {void}
 */
function parseData(data) {
    data.results.map(movie => topRatedMovies.push(movie));
    drawTopRated();
}
/**
 * Draw the movie card on the html page
 * @param {void}void
 * @returns {void}
 */
function drawTopRated() {
    const path = window.location.pathname;
    const container = document.querySelector('.slider');
    let html = ``;
    const imgurl = 'https://image.tmdb.org/t/p/original/';
    topRatedMovies.forEach(movie => {
        const classVote = checkVote(movie.vote_average);
        let moviePoster = movie.poster_path;
        const error = `assets/error-404-message.png`;
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
    $(container).slick({
        infinite: false,
        arrows: false,
        slidesToScroll: 1,
        slidesToShow: 5,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                }
            },
            {
                breakpoint: 922,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 707,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },

        ]

    });
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
/**
 * Take the voat number and make it a float number for better styling
 * @param {number} rate 
 * @returns {string} rate_float
 */
function convertToFloat(number) {
    return Number.isInteger(number) ? (number + ".0") : (number.toString());
}