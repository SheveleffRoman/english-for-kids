/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import { ElementBuilder } from './createCategoryCards.js';
import { cards, menuLinks } from './header.js';
import { pushToLocalStorage, pushTrainedToLocalStorage } from './stats.js';

export const playBtn = document.querySelector('.start-game');
export const repeatBtn = document.querySelector('.repeat-word');
const stars = document.querySelector('.stars');
console.log(stars);

// export function flipButtons() {
//   const flipBtn = document.querySelectorAll(".info_btn");
//   console.log(flipBtn);
//   flipBtn.forEach((btn) =>
//     btn.addEventListener("click", () => {
//       const wordCard = btn.closest(".card");

//       pushTrainedToLocalStorage(wordCard);

//       wordCard.classList.add("flip");
//       btn.classList.add("hidden");
//       const backCard = wordCard.querySelector(".card_back");
//       console.log(backCard);
//       backCard.addEventListener("mouseleave", () => {
//         wordCard.classList.remove("flip");
//         btn.classList.remove("hidden");
//       });
//     })
//   );
// }

export function flipButtons() {
  const flipBtn = document.querySelectorAll('.info_btn');
  console.log(flipBtn);
  flipBtn.forEach((btn) => btn.addEventListener('click', (event) => {
    event.stopPropagation();
    const wordCard = btn.closest('.card');

    pushTrainedToLocalStorage(wordCard);

    wordCard.classList.add('flip');
    // btn.classList.add("hidden");
    const backCard = wordCard.querySelector('.card_back');
    console.log(backCard);

    // Добавляем обработчик для устройств с сенсорными экранами
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
    if (isTouchDevice) {
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('touchend', outsideClickHandler);
    } else {
      // eslint-disable-next-line no-use-before-define
      backCard.addEventListener('mouseleave', outsideClickHandler);
    }

    function outsideClickHandler() {
      wordCard.classList.remove('flip');
      btn.classList.remove('hidden');

      // Удаляем обработчик для устройств с сенсорными экранами
      if (isTouchDevice) {
        document.removeEventListener('touchend', outsideClickHandler);
      } else {
        backCard.removeEventListener('mouseleave', outsideClickHandler);
      }
    }
  }));
}

// export function playSound() {
//   const soundBtn = document.querySelectorAll(".sound_btn");
//   console.log(soundBtn);
//   soundBtn.forEach((btn) => {
//     btn.addEventListener("click", function () {
//       let soundPath = btn.firstChild.getAttribute("data-sound");
//       let audio = new Audio(soundPath);
//       audio.play();
//     });
//   });
// }

function clickCardSound() {
  const soundBtn = this.querySelector('.sound_btn');
  const soundPath = soundBtn.firstChild.getAttribute('data-sound');
  const audio = new Audio(soundPath);
  audio.play();
}

export function playSound() {
  // eslint-disable-next-line no-shadow
  const cards = document.querySelectorAll('.card_face');
  console.log(cards);
  cards.forEach((card) => {
    card.addEventListener('click', clickCardSound);
  });
}

export const changeMode = document.getElementById('app_mode_input');

export function playMode() {
  console.log(changeMode);
  // eslint-disable-next-line no-shadow
  const cards = document.querySelectorAll('.card_face > .card_info');
  const cardFaces = document.querySelectorAll('.card_face');
  console.log(cards);
  changeMode.addEventListener('change', () => {
    if (changeMode.checked) {
      cards.forEach((card) => card.classList.add('play-mode'));
      cardFaces.forEach((card) => card.removeEventListener('click', clickCardSound));
    } else {
      cards.forEach((card) => card.classList.remove('play-mode'));
      cardFaces.forEach((card) => card.addEventListener('click', clickCardSound));
    }
  });
}

export function playPanelView() {
  const playPanel = document.querySelector('.play-panel');
  const stars = document.querySelector('.stars');
  changeMode.addEventListener('change', () => {
    playPanel.classList.toggle('game');
    stars.classList.toggle('no-display');
  });
}

export function playPanelButtonsOn() {
  cards.forEach((card) => card.addEventListener('click', () => playBtn.removeAttribute('disabled')));
  menuLinks.forEach((link) => link.addEventListener('click', () => playBtn.removeAttribute('disabled')));
  playBtn.addEventListener('click', () => {
    playBtn.setAttribute('disabled', 'true');
    repeatBtn.removeAttribute('disabled');
  });
  playBtn.addEventListener('click', () => {
    changeMode.addEventListener('click', () => {
      playBtn.removeAttribute('disabled');
      repeatBtn.setAttribute('disabled', 'true');
    });
  });
}

export const correctWords = [];
export const incorrectWords = [];

export function goPlay() {
  playBtn.addEventListener('click', async () => {
    // eslint-disable-next-line no-use-before-define
    const soundArr = await createSound();
    let currentWord = soundArr[0];
    console.log(currentWord);
    let soundPath = currentWord.sound;
    let audio = new Audio(soundPath);
    audio.play();

    changeMode.addEventListener('change', () => {
      window.location.href = './index.html';
    });
    // console.log("Find the card with the word:", currentWord.en);

    repeatBtn.addEventListener('click', () => repeatLastWord(currentWord));

    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('click', () => {
        const clickedWord = this.dataset.word;
        const clickedCategory = this.dataset.category;
        if (clickedWord === currentWord.en) {
          card.classList.add('green');
          card.classList.add('non-clickable');
          makeStar(true);
          // console.log("Right choice:", clickedWord);
          const obj = { category: clickedCategory, word: clickedWord };
          correctWords.push(obj);
          // console.log(localStorage);
          soundArr.shift();
          if (soundArr.length > 0) {
            // eslint-disable-next-line prefer-destructuring
            currentWord = soundArr[0];
            soundPath = currentWord.sound;
            audio = new Audio(soundPath);
            setTimeout(() => audio.play(), 500);
            // console.log("Find the card with the word:", currentWord.en);
          } else {
            console.log('All words have been matched.');
            console.log(correctWords);
            console.log(incorrectWords);

            pushToLocalStorage();

            setTimeout(() => makeSummary(), 2000);
            return setTimeout(() => {
              window.location.href = './index.html';
            }, 7000);
          }
        } else {
          makeStar(false);
          const obj = { category: clickedCategory, word: currentWord.en };
          incorrectWords.push(obj);
        }
      });
    });
  });
}

function repeatLastWord(currentWord) {
  if (currentWord) {
    const soundPath = currentWord.sound;
    const audio = new Audio(soundPath);
    audio.play();
  }
}

function createSound() {
  const url = new URL(window.location.href);
  const hash = url.hash.slice(1);
  return getSoundArray(hash);
}

async function getSoundArray(category) {
  try {
    const response = await fetch('./src/scripts/cards.json');
    const data = await response.json();
    let soundArr = data[category].words;
    soundArr = shuffleArray(soundArr); // Перемешиваем массив
    // console.log(soundArr);
    return soundArr;
  } catch (error) {
    console.error('Error:', error);
  }
}

function shuffleArray(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    // eslint-disable-next-line no-plusplus
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
    const star = new ElementBuilder('div')
      .setAttribute('class', 'star')
      .build();
    stars.appendChild(star);
    const starSound = new Audio('./src/sounds/stars/right.mp3');
    starSound.play();
    return star;
  }
  const noStar = new ElementBuilder('div')
    .setAttribute('class', 'no-star')
    .build();
  stars.appendChild(noStar);
  const starSound = new Audio('./src/sounds/stars/wrong.mp3');
  starSound.play();
  return noStar;
}

function makeSummary() {
  const cardsContainer = document.querySelector('.cards-container');
  cardsContainer.innerHTML = '';
  const summary = new ElementBuilder('div')
    .setAttribute('class', 'summary')
    .build();
  const headerSummary = new ElementBuilder('h1').build();
  const res = new ElementBuilder('p').build();

  if (incorrectWords.length === 0) {
    headerSummary.textContent = 'Great!';
    res.textContent = 'You made 0 mistakes, congratulations!';
  } else {
    headerSummary.textContent = 'Ooooops!';
    res.textContent = `You made ${incorrectWords.length} errors, try again!!`;
  }

  // add pic later...
  cardsContainer.appendChild(summary);
  summary.appendChild(headerSummary);
  summary.appendChild(res);
}
