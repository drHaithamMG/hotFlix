/**Importing js scrupts
 */
'topRated.js'
'listeners.js'
'popular.js'
document.addEventListener("DOMContentLoaded", () => {
    /*DOMContentLoaded*/
    main();
    /*DOMConentLoadedEnd */
});
/**launch main script
 * @param {void}
 * @returns {void}
 */
function main() {
    topRated();
    popular();
}


// const cpyright=document.querySelector('.cpyright');
// const thisYear=new Date();
// cpyright.innerHTML=`&copy${thisYear.getFullYear()} HotFlix
// cloned by Haitham Al-Mughrabi`;