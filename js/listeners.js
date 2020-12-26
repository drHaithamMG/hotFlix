//get slider class
const mainSlider = document.querySelector('.slider');
//left button for slider listener
const leftButtonSlider = document.querySelector('.left-button-slider');
leftButtonSlider.addEventListener('click', event => {
    $(mainSlider).slick('slickPrev');
});
//right button for slider listener
const rightButtonSlider = document.querySelector('.right-button-slider');
rightButtonSlider.addEventListener('click', event => {
    $(mainSlider).slick('slickNext');
});
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
//burger-menu
const navSlide = () =>{
    const burger=document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    burger.addEventListener("click", ()=>{
        nav.classList.toggle('nav-active');
        burger.classList.toggle('x-style')
    })
}
//Search-mobile
const searchMobile = () =>{
    const searchMobileIcon=document.querySelector('.search-icon-mobile');
    const search = document.querySelector('.search');
    searchMobileIcon.addEventListener("click", ()=>{
        search.classList.toggle('hide-search');
        searchMobileIcon.classList.toggle('search-active')
    })
}

