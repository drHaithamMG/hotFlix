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

