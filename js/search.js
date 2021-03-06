document.addEventListener("DOMContentLoaded", () => {
    /*DOMContentLoaded*/

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
    /**
     * Take search content and make a query then fetch the data
     * @param {string} searchContent 
     * @returns {void} void
     */
    function queryForSearchContent(searchContent) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&query=${searchContent}&include_adult=false`)
            .then(queryRespond => queryRespond.json())
            .then(queryResult => analysingResults(queryResult));
    }
    /**
     * Check the query resuld wheather it's empty or not empty 
     * then convert data to a meaningful style
     * @param {Object} queryResult 
     * @returns {void} void
     */
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
    /**
     * Draw the movie card on the html page
     * @param {void}void
     * @returns {void}
     */
    function drawMovies() {
        searchWarpper.innerHTML = `
        <span class="search-title">Search For ${searchContent}</span>
        <div class="contant-warpper"></div>
        `
        const container = document.querySelector('.contant-warpper');
        let html = ``;
        const path = window.location.pathname;
        const imgurl = 'https://image.tmdb.org/t/p/original/';
        searchMovies.forEach(movie => {
            const classVote = checkVote(movie.vote_average);
            let moviePoster = movie.poster_path;
        const error = `../assets/error-404-message.png`;
            html = `  <div class="movie-card">
        <div class="movie-img-container">
        <img src="${moviePoster}" alt="${movie.title}" title="${movie.title}" class="movie-img">
        <span class="rate ${classVote}">${convertToFloat(movie.vote_average)}</span>
        <div class="overlay">
            <a href="${path.substring(0, path.lastIndexOf('/'))}/movie.html?id=${movie.id}" class="img-play-icon" title="${movie.title}">
                <i class="fa fa-play"></i>
            </a>
        </div>
        </div>
        <a class="movie-name" href="${path.substring(0, path.lastIndexOf('/'))}/movie.html?id=${movie.id}">${movie.title}</a>
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
    const fetchIData = async () => {
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
    window.addEventListener("scroll", async () => {
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
    searchInput.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchButton.click();
        }
    });
    //burger-menu

    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    burger.addEventListener("click", () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('x-style')
    })

    //Search-mobile

    const searchMobileIcon = document.querySelector('.search-icon-mobile');
    const search = document.querySelector('.search');
    searchMobileIcon.addEventListener("click", () => {
        search.classList.toggle('hide-search');
        searchMobileIcon.classList.toggle('search-active')
    });
    const backToTop = document.querySelector('.swip-up');
    backToTop.addEventListener('click', () => {
        console.log('Clicked');
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    })




    /*DOMConentLoadedEnd */
});