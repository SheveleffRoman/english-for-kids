import { ElementBuilder, cardsContainer } from "./createCategoryCards.js";
import { correctWords, incorrectWords } from "./interactive.js";

const statsBtn = document.querySelector(".stats_btn");

export function showStats() {
  statsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    cardsContainer.innerHTML = "";
    getStats();
  });
}

export function pushToLocalStorage() {
  if (!localStorage.correctWords && !localStorage.incorrectWords) {
    localStorage.setItem("correctWords", JSON.stringify(correctWords));
    localStorage.setItem("incorrectWords", JSON.stringify(incorrectWords));
  } else {
    // Получаем текущий массив слов из локального хранилища (если он существует)
    let existingCorrectWords = localStorage.getItem("correctWords");
    let existingIncorrectWords = localStorage.getItem("incorrectWords");

    // Если уже есть слова в локальном хранилище, преобразуем их из JSON в массив
    existingCorrectWords = JSON.parse(existingCorrectWords);
    existingIncorrectWords = JSON.parse(existingIncorrectWords);

    // Добавляем новые слова к существующим
    existingCorrectWords = existingCorrectWords.concat(correctWords);
    existingIncorrectWords = existingIncorrectWords.concat(incorrectWords);

    // Сохраняем обновленный массив слов в локальное хранилище
    localStorage.setItem("correctWords", JSON.stringify(existingCorrectWords));
    localStorage.setItem("incorrectWords", JSON.stringify(existingIncorrectWords));
  }
}

export function pushTrainedToLocalStorage(card) {
  let arr = [{ category: card.dataset.category, word: card.dataset.word }];
  if (!localStorage.trainedWords) {
    localStorage.setItem("trainedWords", JSON.stringify(arr));
  } else {
    let existingTrainedWords = localStorage.getItem("trainedWords");
    existingTrainedWords = JSON.parse(existingTrainedWords);
    existingTrainedWords = existingTrainedWords.concat(arr);
    localStorage.setItem("trainedWords", JSON.stringify(existingTrainedWords));
  }
}

function getStats() {
  let getTrainedWords = localStorage.getItem("trainedWords");
  let getCorrectWords = localStorage.getItem("correctWords");
  let getIncorrectWords = localStorage.getItem("incorrectWords");

  getTrainedWords = JSON.parse(getTrainedWords);
  getCorrectWords = JSON.parse(getCorrectWords);
  getIncorrectWords = JSON.parse(getIncorrectWords);

  //   countStats(getCorrectWords);
  //   countStats(getIncorrectWords);
  let trainedW = countStats(getTrainedWords);
  let correctW = countStats(getCorrectWords);
  let incorrectW = countStats(getIncorrectWords);
  createTable(trainedW, correctW, incorrectW);
}

function countStats(array) {
  if (array) {
    // Подсчет повторений с помощью reduce
    const wordCounts = array.reduce((counts, obj) => {
      const { category, word } = obj;
      const key = `${category}-${word}`;

      // Увеличение счетчика повторений для данного ключа или инициализация его значением 1
      counts[key] = (counts[key] || 0) + 1;

      return counts;
    }, {});

    // Преобразование результата в объект для удобного доступа
    const result = {};
    for (const key in wordCounts) {
      const [category, word] = key.split("-");

      // Проверка, есть ли уже запись для данной категории
      if (!result[category]) {
        result[category] = {};
      }

      // Запись подсчета повторений для слова в категории
      result[category][word] = wordCounts[key];
    }

    // Вывод результатов
    console.log(result);
    return result;
  }
  return {};
}

async function createTable(arr1, arr2, arr3) {
  const response = await fetch("./src/scripts/cards.json");
  const data = await response.json();

  cardsContainer.classList.add("table-flex");
  const tableButtons = new ElementBuilder("div")
    .setAttribute("class", "stats_btns")
    .build();

  const difficultWords = new ElementBuilder("a")
    .setAttribute("class", "difficult-words")
    .build();

  difficultWords.textContent = "Repeat difficult words";

  const resetStat = new ElementBuilder("button")
    .setAttribute("class", "reset-stat")
    .build();

  resetStat.textContent = "Reset";

  cardsContainer.appendChild(tableButtons);
  tableButtons.appendChild(difficultWords);
  tableButtons.appendChild(resetStat);

  resetStat.addEventListener("click", clearStat);

  const tableOverflow = new ElementBuilder("div")
    .setAttribute("class", "table-overflow")
    .build();

  const table = new ElementBuilder("table")
    .setAttribute("class", "stat-table")
    .build();

  const thead = new ElementBuilder("thead").build();

  const tbody = new ElementBuilder("tbody").build();

  cardsContainer.appendChild(tableOverflow);
  tableOverflow.appendChild(table);
  table.appendChild(thead);
  table.appendChild(tbody);

  thead.innerHTML = `
    <th>Categories</th>
    <th>Words</th>
    <th>Translation</th>
    <th>Trained</th>
    <th>Correct</th>
    <th>Incorrect</th>
    <th>%</th>
    `;

  console.log(data);

  for (let key in data) {
    //  console.log(data[key].words)
    let wordsArr = data[key].words;
    // console.log(wordsArr)
    wordsArr.forEach((element) => {
      const tableRow = new ElementBuilder("tr").build();
      tbody.appendChild(tableRow);

      const categ = new ElementBuilder("td").build();
      categ.textContent = key;
      const word = new ElementBuilder("td").build();
      word.textContent = element.en;
      const translation = new ElementBuilder("td").build();
      translation.textContent = element.ru;

      let elem = element.en;
      const trained = new ElementBuilder("td").build();
      const correct = new ElementBuilder("td").build();
      const incorrect = new ElementBuilder("td").build();
      const rate = new ElementBuilder("td").build();

      if (!arr1[key] || !arr1[key][elem]) {
        trained.textContent = "0";
      } else {
        trained.textContent = arr1[key][elem];
      }

      if (!arr2[key] || arr2.length === 0) {
        correct.textContent = "0";
      } else {
        correct.textContent = arr2[key][elem];
      }

      if (!arr3[key] || !arr3[key][elem]) {
        incorrect.textContent = "0";
      } else {
        incorrect.textContent = arr3[key][elem];
      }

      if (correct.textContent === "0" && incorrect.textContent === "0") {
        rate.textContent = "0";
      } else {
        let percentage =
          (parseInt(correct.textContent) /
            (parseInt(correct.textContent) + parseInt(incorrect.textContent))) *
          100;
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
}

function clearStat() {
  localStorage.clear();
  statsBtn.click();
}
