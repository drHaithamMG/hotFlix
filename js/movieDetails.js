//page load listener
window.addEventListener('load', (event) => {
    const movieID = getParameterByName('id');
    fetchMovieDetails(movieID);
    getSimiler(movieID);
});
//Global variables
let similerMovies = [];


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
/**
 * Fetch movie details
 * @param {number} movieID 
 * @returns {void}
 */
function fetchMovieDetails(movieID) {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US`)
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => parseData(data));
}
/**
 * check for error on response
 * @param {number} error 
 */
function showError(error) {
    if (error == 401||error==400) {
        console.log('URL is not found');
    }
}
/**
 * Parse response to meaningful way to extract 
 * the movie details
 * @param {object} data 
 * @returns {void}
 */
function parseData(data) {
    const cover = data.backdrop_path;
    drawMovieCover(cover);
    drawMovieDetails(data);
}
/**
 * Render the cover on the page
 * @param {string} cover 
 * @returns {void}
 */
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
/**
 * Render the movie details on the page
 * @param {object} data 
 * @returns {void}
 */
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
/**
 * Get similer movie's data
 * @param {number} movieID 
 */
function getSimiler(movieID) {
    getSimilerData(movieID);
}
/**
 * Fetch similer movies from the server
 * @param {number} movieID 
 * @returns {void}
 */
function getSimilerData(movieID) {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&page=1`)
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => parseSimilerData(data));
}
/**
 * Parse similer movie data to a meaningful way
 * then render the slider with it's content
 * @param {object} data
 * @returns {void}
 */
function parseSimilerData(data) {
    if (data.results.length > 0) {
        addSliderSection();
        totalPagesNumberOfSimilerMovies = data.total_pages;
        data.results.map(movie => similerMovies.push(movie));
        const container = document.querySelector('.slider');
        let html = ``;
        const imgurl = 'https://image.tmdb.org/t/p/original/';
        similerMovies.forEach(movie => {
            const classVote = checkVote(movie.vote_average);
            html = `  <div class="movie-card">
            <img src="${imgurl + movie.poster_path}" alt="${movie.title}" title="${movie.title}" class="movie-img">
            <span class="rate ${classVote}">${convertToFloat(movie.vote_average)}</span>
            <a class="movie-name" href="/pages/movie.html?id=${movie.id}">${movie.title}</a><br/>
            <span class="date">${movie.release_date}</span>
          </div>`
            container.innerHTML += html;
        })
        $(container).slick({
            infinite: false,
            arrows: false,
            slidesToScroll: 5,
            slidesToShow: 5,

        });
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
 * Convert the rate number to a float for better designing
 * @param {number} vote (integer)
 * @returns {string} vote
 */
function convertToFloat(number) {
    return Number.isInteger(number) ? (number + ".0") : (number.toString());
}
/**
 * Add slider section only if there is data
 * @param {void}
 * @returns {void}
 */
function addSliderSection() {
    document.querySelector('.slider-container').innerHTML = ` <div class="contant">
    <div class="holder">
      <span class="main-title">More to watch</span>
      <div class="buttons">
        <button class="left-button-slider" title="Previous">
          &leftarrow;
        </button>
        <button class="right-button-slider" title="Next">
          &rightarrow;
        </button>
      </div>
    </div>
    <div class="slider"></div>
  </div>`;
    turnOnButtonsListeners();
}
/**
 * Trun on listeners of slider buttons
 * @param {void}
 * @returns {void}
 */
function turnOnButtonsListeners() {
    //get slider class
    const movieSlider = document.querySelector('.slider');
    //left button for slider listener
    const leftButtonSlider = document.querySelector('.left-button-slider');
    leftButtonSlider.addEventListener('click', event => {
        $(movieSlider).slick('slickPrev');
    });
    //right button for slider listener
    const rightButtonSlider = document.querySelector('.right-button-slider');
    rightButtonSlider.addEventListener('click', event => {
        $(movieSlider).slick('slickNext');
    });
}