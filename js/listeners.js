'listeners.js'
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
const secondSectionListener = document.querySelector('.contant-warpper');
//scroll listener
window.addEventListener("scroll", async () => {
    // Do not run if currently fetching
    if (isFetching) return;

    // Scrolled to bottom
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        await fetchIData();
    }
});
//