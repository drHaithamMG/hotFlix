const popularMovies = [];
let currentPage;
let totalPages;
function popular() {
    fetchPopularData();
}
function fetchPopularData() {
    fetch('https://api.themoviedb.org/3/movie/popular?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&page=1')
        .then(response => (response.status == 200) ? response.json() : showError(response.status))
        .then(data => parsePopularData(data));
}
function parsePopularData(data) {
    totalPages=data.total_pages;
    currentPage=data.page;
    console.log(totalPages,currentPage);
    data.results.map(movie => {
        popularMovies.push(movie);
    });
    console.log(popularMovies);
    drawPopular();
}
function drawPopular(){
    const container = document.querySelector('.contant-warpper');
    let html = ``;
    const imgurl = 'https://image.tmdb.org/t/p/original/';
    popularMovies.forEach(movie => {
        const classVote=checkVote(movie.vote_average);
        html = `<div class="movie-card">
        <img src="${imgurl + movie.backdrop_path}" alt="${movie.title}" title="${movie.title}" class="movie-img">
        <span class="rate ${classVote}">${convertToFloat(movie.vote_average)}</span>
        <span class="movie-name">${movie.title}</span>
        <span class="date">${movie.release_date}</span>
      </div>`
        container.innerHTML += html;
    })
 
}
function convertToFloat(number){
    return Number.isInteger(number) ? (number+ ".0") : (number.toString());
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
function checkVote(averageVote){
    return (averageVote>7)?'rate-high':'rate-low';
}

