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

export function goPlay() {
  repeatBtn.addEventListener("click", repeatLastWord);

  playBtn.addEventListener("click", async () => {
    const soundArr = await createSound(); // Получаем массив с объектами
    playNextWord(soundArr);
  });
}

let lastWordObj = null; // Переменная для хранения последнего слова

function playNextWord(soundArr) {
  if (soundArr.length === 0) {
    console.log("WELL DONE!");
    return setTimeout(() => window.location.href = '/index.html', 2000); // Массив слов пуст ВОТ ТУТ ДОЛЖЕН БЫТЬ ИТОГ ПО ОЧКАМ!!!
  }

  let wordObj = soundArr.shift(); // Извлекаем первое слово из массива
  console.log(wordObj);
  lastWordObj = wordObj; // Сохраняем текущее слово как последнее
  let soundPath = wordObj.sound;
  let audio = new Audio(soundPath);
  audio.play();

  // Добавляем обработчик клика для каждой карточки
  const cardElements = document.querySelectorAll(".card_container");
  cardElements.forEach((card) => {
    card.addEventListener("click", function clickHandler() {
      let cardText = card.querySelector(".info_title").textContent;
      if (cardText === wordObj.en) {
        card.removeEventListener("click", clickHandler);
        playNextWord(soundArr); // Проигрываем следующее слово
      } // тут добавить звук ошибки
    });
  });
}

function repeatLastWord() {
  if (lastWordObj) {
    let soundPath = lastWordObj.sound;
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
    console.log(soundArr);
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
