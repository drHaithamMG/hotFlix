//page load listener
window.addEventListener('load', (event) => {
    const movieID = getParameterByName('id');
    fetchMovieDetails(movieID);
    getSimiler(movieID);
});
//Global variables
let similerMovies = [];
let totalPagesNumberOfSimilerMovies;
let currentSimilerMoviesPageNumber = 1;

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
function fetchMovieDetails(movieID) {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US`)
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => parseData(data));
}
function showError(error) {
    if (error == 401) {
        console.log('URL is not found');
    }
}
function parseData(data) {
    const cover = data.backdrop_path;
    drawMovieCover(cover);
    drawMovieDetails(data);
}
function drawMovieCover(cover) {
    const imgContainer = document.querySelector('.movie-img-elements');
    const url = 'https://image.tmdb.org/t/p/original' + cover;
    imgContainer.innerHTML = `<img src='${url}'>`;
    const styleElem = document.head.appendChild(document.createElement("style"));
    const movieDetails = `.movie-img-warpper::before {
        background-image: url(${url});
        background-repeat: no-repeat;
        background-size: cover;
        content: "";
        height: 100%;
        left: 0;
        opacity: 0.1;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: -1;
      }`;
    styleElem.innerHTML = movieDetails;
}
function drawMovieDetails(data) {
    const movieTitle = data.original_title;
    const releaseDate = data.release_date;
    const releaseYear = data.release_date.split('-')[0];
    const overView = data.overview;
    const languages = data.spoken_languages;
    const status = data.status;
    const voteAvg = data.vote_average;
    const movieElementDetails = document.querySelector('.movie-elements-details');
    let movieDetails = `<span class="movie-title">${movieTitle}</span>
    <div class = 'movie-information'>
    <span class="movie-vote-avg">Rate :${voteAvg}/10</span>
    <span class="movie-release-date">Release date : ${releaseDate}</span>
    <span class="movie-release-year">Release year : ${releaseYear}</span>
    
    <span class="movie-status">Movie Status : ${status}</span>
    <div class="movie-languages">Movie languages : </div>
    </div>`
    movieElementDetails.innerHTML = movieDetails;
    const movieLanguages = document.querySelector('.movie-languages');
    languages.forEach(element => {
        movieLanguages.innerHTML = `<span class="movie-language">${element.name}</span>`
    });
    movieDetails = `
    <span class="movie-overview">${overView}</span>
    <div class="movie-stars"></div>`
    movieElementDetails.innerHTML += movieDetails;
}
function getSimiler(movieID) {
    const slider = document.querySelector('.slider');
    getSimilerData(movieID);
    if (similerMovies.length > 0) {
        $('slider').slick({
            infinite: false,
            arrows: false,
            slidesToScroll: 5,
            slidesToShow: 5,
            
        });
        console.log(slideIndex);
        similerMovies.forEach(movie=>{

        })
    }
}
/**
 * Fetch similer movies from the server
 * @param {number} movieID 
 * @returns {void}
 */
function getSimilerData(movieID) {
    fetch(`https://api.themoviedb.org/3/movie/577922/similar?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&page=1`)
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => parseSimilerData(data));
}
/**
 * Parse similer movie data to a meaningful way
 * @param {object} data
 * @returns {void}
 */
function parseSimilerData(data) {
    if (data.results.length > 0) {
        totalPagesNumberOfSimilerMovies = data.total_pages;
        data.results.forEach(movie => similerMovies.push(movie));
    }
}