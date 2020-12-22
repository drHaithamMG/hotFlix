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
function parsePopularData(data) {
    totalPages = data.total_pages;
    console.log(totalPages, currentPage);
    data.results.map(movie => {
        popularMovies.push(movie);
    });
    console.log(popularMovies);
    drawPopular();
}
function drawPopular() {
    const container = document.querySelector('.contant-warpper');
    let html = ``;
    const imgurl = 'https://image.tmdb.org/t/p/original/';
    popularMovies.forEach(movie => {
        const classVote = checkVote(movie.vote_average);
        console.log(movie, movie.backdrop_path);
        const imagePath = imgurl + movie.backdrop_path;
        html = `<div class="movie-card">
        <img src="${imagePath}" alt="${movie.title}" title="${movie.title}" class="movie-img">
        <span class="rate ${classVote}">${convertToFloat(movie.vote_average)}</span>
        <span class="movie-name">${movie.title}</span>
        <span class="date">${movie.release_date}</span>
      </div>`
        container.innerHTML += html;
    })

}
function convertToFloat(number) {
    return Number.isInteger(number) ? (number + ".0") : (number.toString());
}
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

