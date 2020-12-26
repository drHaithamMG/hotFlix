//page load listener
window.addEventListener('load', (event) => {
    const movieID = getParameterByName('id');
    fetchMovieDetails(movieID);
    getSimiler(movieID);
    navSlide();
searchMobile();
});
//Global variables
let similerMovies = [];
let movieStars = [];

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
    if (error == 401 || error == 400) {
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
 * @param {string} coverPath 
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
    const movieId = data.id;
    const movieTitle = data.original_title;
    const releaseDate = data.release_date;
    const releaseYear = data.release_date.split('-')[0];
    const overView = data.overview;
    const languages = data.spoken_languages;
    const genres = data.genres;
    const status = data.status;
    const voteAvg = data.vote_average;
    const movieElementDetails = document.querySelector('.movie-elements-details');
    let movieDetails = `<span class="movie-title">${movieTitle}</span>
    <div class = 'movie-information'>
    <span class="movie-vote-avg" title="Rate">${voteAvg}/10</span>
    <span class="movie-release-date" title="Release date">${releaseDate}</span>
    <span class="movie-status" title="Movie Status">${status}</span>
    <div class="movie-languages-holder"></div>
    </div>`
    movieElementDetails.innerHTML = movieDetails;
    const movieLanguages = document.querySelector('.movie-languages-holder');
    languages.forEach(element => {
        movieLanguages.innerHTML += `<span class="movie-languages">${element.name}</span>`
    });
    movieDetails = `
    <div class = 'trailer-button-warpper'>
    <img class= 'trailer-button-img ' src="../assets/video-play-png-icon-.png" alt="play"> 
    <span class = 'trailer-button-text' >${movieTitle}'s trailer</span>
    <div class="trailer-section"></div>
    </div>
    <span class="movie-overview">${overView}</span>
    <div class="movie-genres-holder"></div>
    `;
    movieElementDetails.innerHTML += movieDetails;
    const movieGenres = document.querySelector('.movie-genres-holder');
    genres.forEach(element => {
        movieGenres.innerHTML += `<span class="movie-genres">${element.name}</span>`
    });
    movieDetails = `
    <span class = "title-main-actors">Movie main actors</span>
    <div class="movie-stars"></div>`
    movieElementDetails.innerHTML += movieDetails;
    getStars(data.id);
    const trailerButtonListener = document.querySelector('.trailer-button-img ');
    trailerButtonListener.addEventListener('click', () => fetchMovieTrailer(movieId))
}
/**
 * Fetch the movie trailer by it id
 * @param {number} movieid 
 * @returns {void}
 */
function fetchMovieTrailer(id) {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US
    `)
        .then(response => response.json())
        .then(data => showTrailer(data.results))
}
/**
 * Show the trailer on the html site
 * @param {Object} movieTrailerInformation 
 * @returns {void}
 */
function showTrailer(array) {
    const movieTrailerKey = array[0].key;
    const movieTrailerPlayer = document.querySelector('.trailer-button-warpper');
    movieTrailerPlayer.innerHTML = `
    <iframe width="1280" height="720" src="https://www.youtube.com/embed/${movieTrailerKey}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
}
/**
 * Fetch stars of the movie
 * @param {number} moive_id 
 * @returns {void}
 */
function getStars(id) {
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US`)
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => {
            if (data.cast.length > 0) {
                data.cast.map(actor => movieStars.push(actor));
                const actors = document.querySelector('.movie-stars');
                movieStars.forEach(actor => {
                    actors.innerHTML += `<span class='actor-span'>${actor.name}</span>`
                })
            }
        });
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
        $(container).slick({
            infinite: false,
            arrows: false,
            slidesToScroll: 5,
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
                    breakpoint: 950,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                }, {
                    breakpoint: 660,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
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
//Search listener
const searchButton = document.querySelector('.icon');
const searchInput = document.getElementById('movie-search');
searchButton.addEventListener('click', () => {
    if (searchInput.value != '')
        window.open(`search.html?search=${searchInput.value}`, '_self');
    else
        alert("Search field is empty!\nKindly enter something")
})
searchInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchButton.click();
    }
});
/**
 * add the functionallity for the burger button
 * @param {void} void
 * @returns {void}
 */
const navSlide = () =>{
    const burger=document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    burger.addEventListener("click", ()=>{
        nav.classList.toggle('nav-active');
        burger.classList.toggle('x-style')
    })
}
/**
 * add the functionallity for the search button
 * @param {void} void
 * @returns {void}
 */
const searchMobile = () =>{
    const searchMobileIcon=document.querySelector('.search-icon-mobile');
    const search = document.querySelector('.search');
    searchMobileIcon.addEventListener("click", ()=>{
        search.classList.toggle('hide-search');
        searchMobileIcon.classList.toggle('search-active')
    })
}

