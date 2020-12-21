/**
 * main function to build top rated movies
 * @param {void}  
 */
const topRatedMovies=[];
function topRated(){
    fetchData();
    console.log(topRatedMovies);
}
/**FetchData function
 * Fetch Related Movies from themoviedb.org
 * @param {void}
 * @returns {void}
 */
function fetchData() {
    console.log('fetch data running');
    fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=72d1f40a92f130a0e4229203411f9b12&language=en-US&page=1')
    .then(response =>(response.status==200)?response.json():showError(response.status))
    .then(data => parseData(data));
}
/**
 * Parse data to meaningful structure 
 * @param {Object} data fetched data from themoviedb.org
 * @returns {void}
 */
function parseData(data) {
    data.results.map(movie=>topRatedMovies.push(movie));
    drawTopRated();

    console.log('parse data running');
}
function drawTopRated(){
    console.log('draw top rated running');
    console.log(topRatedMovies);
    const container=document.querySelector('.slider');
    let html=``;
    const imgurl='https://image.tmdb.org/t/p/original/';
    topRatedMovies.forEach(movie=>{
        console.log('im here');
        console.log('movie',movie);
        html=`  <div class="movie-card">
        <img src="${imgurl+movie.backdrop_path}" alt="movie.title" class="movie-img">
        <span class="rate">${movie.vote_average}</span>
        <span class="movie-name">${movie.title}</span>
        <span class="date">${movie.release_date}</span>
      </div>`
        container.innerHTML+=html;
        console.log(html);
    })
}
function showError(error){
    if(error==401){
        console.log('URL is not found');
    }
}
