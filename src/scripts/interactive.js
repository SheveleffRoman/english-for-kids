import { ElementBuilder } from "./createCategoryCards.js";
import { cards, menuLinks } from "./header.js";

export const playBtn = document.querySelector(".start-game");
export const repeatBtn = document.querySelector(".repeat-word");
const stars = document.querySelector(".stars");
console.log(stars);

export function flipButtons() {
  const flipBtn = document.querySelectorAll(".info_btn");
  console.log(flipBtn);
  flipBtn.forEach((btn) =>
    btn.addEventListener("click", () => {
      const wordCard = btn.closest(".card");
      wordCard.classList.add("flip");
      btn.classList.add("hidden");
      const backCard = wordCard.querySelector(".card_back");
      console.log(backCard);
      backCard.addEventListener("mouseleave", () => {
        wordCard.classList.remove("flip");
        btn.classList.remove("hidden");
      });
    })
  );
}

export function playSound() {
  const soundBtn = document.querySelectorAll(".sound_btn");
  console.log(soundBtn);
  soundBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let soundPath = btn.firstChild.getAttribute("data-sound");
      let audio = new Audio(soundPath);
      audio.play();
    });
  });
}

const changeMode = document.getElementById("app_mode_input");

export function playMode() {
  console.log(changeMode);
  const cards = document.querySelectorAll(".card_face > .card_info");
  console.log(cards);
  changeMode.addEventListener("change", () => {
    cards.forEach((card) => card.classList.toggle("play-mode"));
  });
}

export function playPanelView() {
  const playPanel = document.querySelector(".play-panel");
  const stars = document.querySelector(".stars");
  changeMode.addEventListener("change", () => {
    playPanel.classList.toggle("game");
    stars.classList.toggle("no-display");
  });
}

export function playPanelButtonsOn() {
  cards.forEach((card) =>
    card.addEventListener("click", () => playBtn.removeAttribute("disabled"))
  );
  menuLinks.forEach((link) =>
    link.addEventListener("click", () => playBtn.removeAttribute("disabled"))
  );
  playBtn.addEventListener("click", () => {
    playBtn.setAttribute("disabled", "true");
    repeatBtn.removeAttribute("disabled");
  });
  playBtn.addEventListener("click", () => {
    changeMode.addEventListener("click", () => {
      playBtn.removeAttribute("disabled");
      repeatBtn.setAttribute("disabled", "true");
    });
  });
}

const correctWords = [];
const incorrectWords = [];

export function goPlay() {
  playBtn.addEventListener("click", async function () {
    const soundArr = await createSound();
    let currentWord = soundArr[0];
    let soundPath = currentWord.sound;
    let audio = new Audio(soundPath);
    audio.play();
    // console.log("Find the card with the word:", currentWord.en);

    repeatBtn.addEventListener("click", () => repeatLastWord(currentWord));

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", function () {
        const clickedWord = this.dataset.word;
        if (clickedWord === currentWord.en) {
          card.classList.add("green");
          card.classList.add("non-clickable");
          makeStar(true);
          // console.log("Right choice:", clickedWord);
          correctWords.push(clickedWord);
          // console.log(correctWords)
          soundArr.shift();
          if (soundArr.length > 0) {
            currentWord = soundArr[0];
            soundPath = currentWord.sound;
            audio = new Audio(soundPath);
            setTimeout(() => audio.play(), 500);
            // console.log("Find the card with the word:", currentWord.en);
          } else {
            console.log("All words have been matched.");
            console.log(correctWords);
            console.log(incorrectWords);
            setTimeout(() => makeSummary(), 2000)
            return setTimeout(
              () => (window.location.href = "/index.html"),
              5000
            );
          }
        } else {
          makeStar(false);
          incorrectWords.push(currentWord.en);
          // console.log(incorrectWords);
          // console.log("Find the card with the word:", currentWord.en);
        }
      });
    });
  });
}
// возможно, что придется убрать и вписать в основную
function repeatLastWord(currentWord) {
  if (currentWord) {
    let soundPath = currentWord.sound;
    let audio = new Audio(soundPath);
    audio.play();
  }
}

function createSound() {
  let url = new URL(window.location.href);
  let hash = url.hash.slice(1);
  return getSoundArray(hash);
}

async function getSoundArray(category) {
  try {
    const response = await fetch("./src/scripts/cards.json");
    const data = await response.json();
    let soundArr = data[category].words;
    soundArr = shuffleArray(soundArr); // Перемешиваем массив
    // console.log(soundArr);
    return soundArr;
  } catch (error) {
    console.error("Error:", error);
  }
}

function shuffleArray(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

function makeStar(isMatch) {
  if (isMatch) {
    const star = new ElementBuilder("div")
      .setAttribute("class", "star")
      .build();
    stars.appendChild(star);
    let starSound = new Audio('./src/sounds/stars/right.mp3');
    starSound.play();
    return star;
  } else {
    const noStar = new ElementBuilder("div")
      .setAttribute("class", "no-star")
      .build();
    stars.appendChild(noStar);
    let starSound = new Audio('./src/sounds/stars/wrong.mp3');
    starSound.play();
    return noStar;
  }
}

function makeSummary() {
  const cardsContainer = document.querySelector(".cards-container");
  cardsContainer.innerHTML = "";
  if (incorrectWords.length === 0) {
    cardsContainer.innerHTML = `<div class="summary">Вы сделали 0 ошибок, поздравляю!</div>`;
  } else if (incorrectWords.length === 1) {
    cardsContainer.innerHTML = `<div class="summary">Вы сделали ${incorrectWords.length} ошибку, почти получилось!</div>`
  } else {
    cardsContainer.innerHTML = `<div class="summary">Вы сделали ${incorrectWords.length} ошибки, попробуй еще!</div>`
  }
}