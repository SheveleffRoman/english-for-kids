import { toggleMenu, menuClick } from "./scripts/header.js";
import { categoryCardClick } from "./scripts/createCategoryCards.js";
import { goPlay, playPanelButtonsOn, playPanelView } from "./scripts/interactive.js";
toggleMenu();
menuClick();
categoryCardClick();
playPanelView();
playPanelButtonsOn();
goPlay()

// const changeMode = document.getElementById("app_mode_input");
// const playBtn = document.querySelector('.start-game');
// const repeatBtn = document.querySelector('.repeat-word')

// playBtn.addEventListener('click', () => {
//     changeMode.addEventListener('click', () => {
//         playBtn.removeAttribute("disabled")
//         repeatBtn.setAttribute('disabled', 'true')
//     })
// })