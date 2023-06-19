import { cardsContainer } from "./createCategoryCards.js";
import { correctWords, incorrectWords } from "./interactive.js";

const statsBtn = document.querySelector(".stats_btn");

export function showStats() {
  statsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    cardsContainer.innerHTML = "";
    getStats()
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
    localStorage.setItem(
      "incorrectWords",
      JSON.stringify(existingIncorrectWords)
    );
  }
}

function getStats() {
    let getCorrectWords = localStorage.getItem("correctWords");
    let getIncorrectWords = localStorage.getItem("incorrectWords");

    getCorrectWords = JSON.parse(getCorrectWords);
    getIncorrectWords = JSON.parse(getIncorrectWords);

    countStats(getCorrectWords);
    countStats(getIncorrectWords);

}

function countStats (array) {
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
    const [category, word] = key.split('-');
  
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