/* eslint-disable no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import { ElementBuilder, cardsContainer } from './createCategoryCards.js';
import {
  changeMode,
  correctWords,
  flipButtons,
  incorrectWords,
  playSound,
} from './interactive.js';

const statsBtn = document.querySelector('.stats_btn');

export function showStats() {
  statsBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (changeMode.checked) {
      changeMode.click();
    }
    changeMode.setAttribute('disabled', 'true');
    changeMode.nextElementSibling.classList.add('inactive');
    cardsContainer.innerHTML = '';
    getStats();
  });
}

export function pushToLocalStorage() {
  if (!localStorage.correctWords && !localStorage.incorrectWords) {
    localStorage.setItem('correctWords', JSON.stringify(correctWords));
    localStorage.setItem('incorrectWords', JSON.stringify(incorrectWords));
  } else {
    // Получаем текущий массив слов из локального хранилища (если он существует)
    let existingCorrectWords = localStorage.getItem('correctWords');
    let existingIncorrectWords = localStorage.getItem('incorrectWords');

    // Если уже есть слова в локальном хранилище, преобразуем их из JSON в массив
    existingCorrectWords = JSON.parse(existingCorrectWords);
    existingIncorrectWords = JSON.parse(existingIncorrectWords);

    // Добавляем новые слова к существующим
    existingCorrectWords = existingCorrectWords.concat(correctWords);
    existingIncorrectWords = existingIncorrectWords.concat(incorrectWords);

    // Сохраняем обновленный массив слов в локальное хранилище
    localStorage.setItem('correctWords', JSON.stringify(existingCorrectWords));
    localStorage.setItem(
      'incorrectWords',
      JSON.stringify(existingIncorrectWords),
    );
  }
}

export function pushTrainedToLocalStorage(card) {
  const arr = [{ category: card.dataset.category, word: card.dataset.word }];
  if (!localStorage.trainedWords) {
    localStorage.setItem('trainedWords', JSON.stringify(arr));
  } else {
    let existingTrainedWords = localStorage.getItem('trainedWords');
    existingTrainedWords = JSON.parse(existingTrainedWords);
    existingTrainedWords = existingTrainedWords.concat(arr);
    localStorage.setItem('trainedWords', JSON.stringify(existingTrainedWords));
  }
}

function getStats() {
  let getTrainedWords = localStorage.getItem('trainedWords');
  let getCorrectWords = localStorage.getItem('correctWords');
  let getIncorrectWords = localStorage.getItem('incorrectWords');

  getTrainedWords = JSON.parse(getTrainedWords);
  getCorrectWords = JSON.parse(getCorrectWords);
  getIncorrectWords = JSON.parse(getIncorrectWords);

  //   countStats(getCorrectWords);
  //   countStats(getIncorrectWords);
  const trainedW = countStats(getTrainedWords);
  const correctW = countStats(getCorrectWords);
  const incorrectW = countStats(getIncorrectWords);
  createTable(trainedW, correctW, incorrectW);
}

function countStats(array) {
  if (array) {
    // Подсчет повторений с помощью reduce
    const wordCounts = array.reduce((counts, obj) => {
      const { category, word } = obj;
      const key = `${category}-${word}`;

      // Увеличение счетчика повторений для данного ключа
      counts[key] = (counts[key] || 0) + 1;

      return counts;
    }, {});

    // Преобразование результата в объект
    const result = {};
    for (const key in wordCounts) {
      const [category, word] = key.split('-');

      // Проверка, есть ли уже запись для данной категории
      if (!result[category]) {
        result[category] = {};
      }

      // Запись подсчета повторений для слова в категории
      result[category][word] = wordCounts[key];
    }

    console.log(result);
    return result;
  }
  return {};
}

async function createTable(arr1, arr2, arr3) {
  const response = await fetch('./src/scripts/cards.json');
  const data = await response.json();

  cardsContainer.classList.add('table-flex');
  const tableButtons = new ElementBuilder('div')
    .setAttribute('class', 'stats_btns')
    .build();

  const difficultWords = new ElementBuilder('a')
    .setAttribute('class', 'difficult-words')
    .build();

  difficultWords.textContent = 'Repeat difficult words';

  difficultWords.addEventListener('click', async () => {
    const cardCat = repeatDifficultWords();
    console.log(cardCat);
    cardsContainer.innerHTML = '';
    cardsContainer.classList.remove('table-flex');

    if (cardCat.length !== 0) {
      cardsContainer.classList.add('flex-card');
      //   if (changeMode.checked) {
      //     changeMode.click();
      //   }
      //   changeMode.setAttribute("disabled", "true");
      //   changeMode.nextElementSibling.classList.add("inactive");
      const promises = cardCat.map((elem) => cleanCardsJSON(elem.category, elem.word));
      const result = await Promise.all(promises);
      const suitableObjects = result.flat();
      console.log(suitableObjects);
      createDifficultCards(suitableObjects);
      playSound();
      flipButtons();
    } else {
      makeStatSummary();
      setTimeout(() => {
        statsBtn.click();
      }, 3000);
    }
  });

  const resetStat = new ElementBuilder('button')
    .setAttribute('class', 'reset-stat')
    .build();

  resetStat.textContent = 'Reset';

  cardsContainer.appendChild(tableButtons);
  tableButtons.appendChild(difficultWords);
  tableButtons.appendChild(resetStat);

  resetStat.addEventListener('click', clearStat);

  const tableOverflow = new ElementBuilder('div')
    .setAttribute('class', 'table-overflow')
    .build();

  const table = new ElementBuilder('table')
    .setAttribute('class', 'stat-table')
    .build();

  const thead = new ElementBuilder('thead').build();

  const tbody = new ElementBuilder('tbody').build();

  cardsContainer.appendChild(tableOverflow);
  tableOverflow.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);

  thead.innerHTML = `
    <th class="sortable">Categories<span class="sort-symbol"></span></th>
    <th class="sortable">Words<span class="sort-symbol"></span></th>
    <th class="sortable">Translation<span class="sort-symbol"></span></th>
    <th class="sortable">Trained<span class="sort-symbol"></span></th>
    <th class="sortable">Correct<span class="sort-symbol"></span></th>
    <th class="sortable">Incorrect<span class="sort-symbol"></span></th>
    <th class="sortable">%<span class="sort-symbol"></span></th>
    `;

  console.log(data);

  for (const key in data) {
    //  console.log(data[key].words)
    const wordsArr = data[key].words;
    // console.log(wordsArr)
    wordsArr.forEach((element) => {
      const tableRow = new ElementBuilder('tr').build();
      tbody.appendChild(tableRow);

      const categ = new ElementBuilder('td').build();
      categ.textContent = key;
      const word = new ElementBuilder('td').build();
      word.textContent = element.en;
      const translation = new ElementBuilder('td').build();
      translation.textContent = element.ru;

      const elem = element.en;
      const trained = new ElementBuilder('td').build();
      const correct = new ElementBuilder('td').build();
      const incorrect = new ElementBuilder('td').build();
      const rate = new ElementBuilder('td').build();

      if (!arr1[key] || !arr1[key][elem]) {
        trained.textContent = '0';
      } else {
        trained.textContent = arr1[key][elem];
      }

      if (!arr2[key] || arr2.length === 0) {
        correct.textContent = '0';
      } else {
        correct.textContent = arr2[key][elem];
      }

      if (!arr3[key] || !arr3[key][elem]) {
        incorrect.textContent = '0';
      } else {
        incorrect.textContent = arr3[key][elem];
      }

      if (correct.textContent === '0' && incorrect.textContent === '0') {
        rate.textContent = '0';
      } else {
        const percentage = (parseInt(correct.textContent)
            / (parseInt(correct.textContent) + parseInt(incorrect.textContent)))
          * 100;
        rate.textContent = percentage.toFixed(0);
      }
      tableRow.appendChild(categ);
      tableRow.appendChild(word);
      tableRow.appendChild(translation);
      tableRow.appendChild(trained);
      tableRow.appendChild(correct);
      tableRow.appendChild(incorrect);
      tableRow.appendChild(rate);
    });
  }
  const headers = document.querySelectorAll('.sortable');
  for (let i = 0; i < headers.length; i++) {
    const table = headers[i].closest('table');
    const column = Array.from(headers[i].parentNode.cells).indexOf(headers[i]);

    // Установка начального порядка сортировки в "asc" для первых трех столбцов
    // и "desc" для вторых трех столбцов
    // чтоб при первом нажатии они сортировались по убыванию
    if (column < 3) {
      table.setAttribute(`data-sort-order-${column}`, 'desc');
    } else {
      table.setAttribute(`data-sort-order-${column}`, 'asc');
    }

    headers[i].addEventListener('click', function () {
      const column = Array.from(this.parentNode.cells).indexOf(this);
      sortTable(table, column);
    });
  }
}

function clearStat() {
  localStorage.clear();
  statsBtn.click();
}

function repeatDifficultWords() {
  // Получение всех рядов таблицы
  const rows = document.querySelectorAll('tbody tr');

  // Создание массива для хранения подходящих рядов
  let suitableRows = [];

  // Проход по каждому ряду таблицы
  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');

    // Проверка, содержит ли последняя ячейка число меньше или равно 25
    const lastCell = cells[cells.length - 1];
    const cellValue = parseInt(lastCell.innerText || lastCell.textContent);

    if (!isNaN(cellValue) && cellValue !== 0 && cellValue <= 25) {
      suitableRows.push(row);
    }
  });

  // Проверка, есть ли более 8 подходящих рядов
  if (suitableRows.length > 8) {
    // Перемешивание массива подходящих рядов
    suitableRows.sort(() => 0.5 - Math.random());

    // Обрезка массива до 8 элементов
    suitableRows = suitableRows.slice(0, 8);
  }

  // Вывод результатов в консоль
  // console.log(suitableRows);
  // return suitableRows;
  // Создание массива для хранения текстового контента первых двух <td> элементов каждого ряда
  const firstTwoTdContents = [];

  // Проход по каждому ряду в массиве suitableRows
  suitableRows.forEach((row) => {
    const cells = row.getElementsByTagName('td');

    // Получение текстового контента первых двух <td> элементов ряда
    const category = cells[0].textContent;
    const word = cells[1].textContent;

    // Добавление текстового контента в массив firstTwoTdContents
    firstTwoTdContents.push({ category, word });
  });

  // Вывод результатов в консоль
  // console.log(firstTwoTdContents);
  return firstTwoTdContents;
}

async function cleanCardsJSON(category, word) {
  try {
    const response = await fetch('./src/scripts/cards.json');
    const data = await response.json();
    const wordsArr = data[category].words;
    const suitableObjects = wordsArr.filter((item) => item.en === word);
    return suitableObjects;
  } catch (error) {
    return [];
  }
}

function extractWordFromImagePath(imagePath) {
  const parts = imagePath.split('/');
  return parts[4];
}

async function createDifficultCards(arr) {
  try {
    arr.forEach((item) => {
      const cardsWrapper = new ElementBuilder('div')
        .setAttribute('class', 'card_container')
        .build();

      const cardElem = new ElementBuilder('div')
        .setAttribute('class', 'card')
        .setAttribute('data-word', `${item.en}`)
        .setAttribute('data-category', `${extractWordFromImagePath(item.img)}`)
        .build();

      cardsContainer.appendChild(cardsWrapper);
      cardsWrapper.appendChild(cardElem);

      const cardFace = new ElementBuilder('div')
        .setAttribute('class', 'card_face')
        .build();

      cardElem.appendChild(cardFace);

      const cardImage = new ElementBuilder('div')
        .setAttribute('class', 'card_image')
        .build();

      cardFace.appendChild(cardImage);

      const imageTag = new ElementBuilder('img').build();
      imageTag.src = item.img;
      imageTag.alt = item.en;

      cardImage.appendChild(imageTag);

      const cardInfo = new ElementBuilder('div')
        .setAttribute('class', 'card_info')
        .build();
      const changeMode = document.getElementById('app_mode_input');
      if (changeMode.checked) {
        cardInfo.setAttribute('class', 'card_info play-mode');
      }

      cardFace.appendChild(cardInfo);

      const infoBtn = new ElementBuilder('div')
        .setAttribute('class', 'info_btn')
        .build();

      cardInfo.appendChild(infoBtn);

      const spanBtn = new ElementBuilder('span')
        .setAttribute('class', 'icon_btn info')
        .build();

      infoBtn.appendChild(spanBtn);

      const infoTitle = new ElementBuilder('div')
        .setAttribute('class', 'info_title')
        .text(`${item.en}`)
        .build();

      cardInfo.appendChild(infoTitle);

      const soundBtn = new ElementBuilder('div')
        .setAttribute('class', 'sound_btn')
        .build();

      cardInfo.appendChild(soundBtn);

      const spanSound = new ElementBuilder('span')
        .setAttribute('class', 'icon_btn')
        .setAttribute('data-sound', `${item.sound}`)
        .build();

      soundBtn.appendChild(spanSound);

      const cardBack = new ElementBuilder('div')
        .setAttribute('class', 'card_back')
        .build();

      cardElem.appendChild(cardBack);

      const cardBackImage = new ElementBuilder('div')
        .setAttribute('class', 'card_image')
        .build();

      cardBack.appendChild(cardBackImage);

      const cardBackImgTag = new ElementBuilder('img').build();

      cardBackImage.appendChild(cardBackImgTag);

      cardBackImgTag.src = item.img;
      cardBackImgTag.alt = item.en;

      const cardBackInfo = new ElementBuilder('div')
        .setAttribute('class', 'card_info')
        .build();

      cardBack.appendChild(cardBackInfo);

      const cardBackTitle = new ElementBuilder('div')
        .setAttribute('class', 'info_title')
        .text(`${item.ru}`)
        .build();

      cardBackInfo.appendChild(cardBackTitle);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function makeStatSummary() {
  cardsContainer.innerHTML = '';
  const summary = new ElementBuilder('div')
    .setAttribute('class', 'summary')
    .build();
  const headerSummary = new ElementBuilder('h1').build();
  const res = new ElementBuilder('p').build();

  headerSummary.textContent = 'Great!';
  res.textContent = 'You have no difficulty with words!';

  // add pic later...
  cardsContainer.appendChild(summary);
  summary.appendChild(headerSummary);
  summary.appendChild(res);
}

function sortTable(table, column) {
  const rows = Array.from(table.tBodies[0].rows);

  // Определение порядка сортировки (desc или asc)
  const sortOrder = table.getAttribute(`data-sort-order-${column}`);
  const order = sortOrder === 'desc' ? 1 : -1;

  rows.sort((a, b) => {
    const cellA = a.cells[column].textContent.trim();
    const cellB = b.cells[column].textContent.trim();

    return (
      order
      * cellA.localeCompare(cellB, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  });

  // Удаление существующих строк
  while (table.tBodies[0].firstChild) {
    table.tBodies[0].removeChild(table.tBodies[0].firstChild);
  }

  // Добавление отсортированных строк
  table.tBodies[0].append(...rows);

  // Удаление символов сортировки с других заголовков столбцов
  const sortSymbols = table.getElementsByClassName('sort-symbol');
  for (let i = 0; i < sortSymbols.length; i++) {
    sortSymbols[i].textContent = '';
  }

  // Добавление символа сортировки для текущего заголовка столбца
  const sortSymbol = table.querySelector(
    `th:nth-child(${column + 1}) .sort-symbol`,
  );
  sortSymbol.textContent = order === 1 ? '↓' : '↑';

  // Изменение порядка сортировки для следующих кликов
  table.setAttribute(
    `data-sort-order-${column}`,
    sortOrder === 'desc' ? 'asc' : 'desc',
  );
}
