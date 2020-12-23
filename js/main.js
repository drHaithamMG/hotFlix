//Importing js scripts
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

