document.addEventListener("DOMContentLoaded", () => {
    /*DOMContentLoaded*/
console.log('DOM has been ');
    /*DOMConentLoadedEnd */
});
const cpyright=document.querySelector('.cpyright');
const thisYear=new Date();
cpyright.innerHTML=`&copy${thisYear.getFullYear()} HotFlix
cloned by Haitham Al-Mughrabi`;