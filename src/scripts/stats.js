import { correctWords, incorrectWords } from "./interactive.js";

const statsBtn = document.querySelector(".stats_btn");

export function showStats() {
  statsBtn.addEventListener("click", (event) => {
    event.preventDefault();
    console.log(localStorage);
  });
}

export function pushToLocalStorage() {
    if (!localStorage.correctWords && !localStorage.incorrectWords) {
        localStorage.setItem(
          "correctWords",
          JSON.stringify(correctWords)
        );
        localStorage.setItem(
          "incorrectWords",
          JSON.stringify(incorrectWords)
        );
      } else {
        // Получаем текущий массив слов из локального хранилища (если он существует)
        let existingCorrectWords = localStorage.getItem("correctWords");
        let existingIncorrectWords =
          localStorage.getItem("incorrectWords");

        // Если уже есть слова в локальном хранилище, преобразуем их из JSON в массив
        existingCorrectWords = JSON.parse(existingCorrectWords);
        existingIncorrectWords = JSON.parse(existingIncorrectWords);

        // Добавляем новые слова к существующим
        existingCorrectWords = existingCorrectWords.concat(correctWords);
        existingIncorrectWords =
          existingIncorrectWords.concat(incorrectWords);

        // Сохраняем обновленный массив слов в локальное хранилище
        localStorage.setItem(
          "correctWords",
          JSON.stringify(existingCorrectWords)
        );
        localStorage.setItem(
          "incorrectWords",
          JSON.stringify(existingIncorrectWords)
        );
      }
}
