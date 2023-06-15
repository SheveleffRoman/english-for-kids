import { cards, menuLinks } from "./header.js";

export const playBtn = document.querySelector(".start-game");
export const repeatBtn = document.querySelector(".repeat-word");

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
  changeMode.addEventListener("change", () => {
    playPanel.classList.toggle("game");
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

    repeatBtn.addEventListener('click', () => repeatLastWord(currentWord));

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", function () {
        const clickedWord = this.dataset.word;
        if (clickedWord === currentWord.en) {
          card.classList.add("green");
          card.classList.add("non-clickable");
          // console.log("Right choice:", clickedWord);
          correctWords.push(clickedWord);
          // console.log(correctWords)
          soundArr.shift();
          if (soundArr.length > 0) {
            currentWord = soundArr[0];
            soundPath = currentWord.sound;
            audio = new Audio(soundPath);
            audio.play();
            // console.log("Find the card with the word:", currentWord.en);
          } else {
            console.log("All words have been matched.");
            console.log(correctWords);
            console.log(incorrectWords);
            return setTimeout(
              () => (window.location.href = "/index.html"),
              5000
            );
          }
        } else {
          incorrectWords.push(currentWord.en);
          // console.log(incorrectWords);
          // console.log("Find the card with the word:", currentWord.en);
        }
      });
    });
  });
}

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
