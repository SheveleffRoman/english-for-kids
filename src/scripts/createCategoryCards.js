import { flipButtons, playMode, playSound } from "./interactive.js";

class ElementBuilder {
  constructor(tagName) {
    this.element = document.createElement(tagName);
  }

  setAttribute(name, value) {
    this.element.setAttribute(name, value);
    return this;
  }

  text(value) {
    this.element.textContent = value;
    return this;
  }

  build() {
    return this.element;
  }
}

export async function createCards(cardId) {
  try {
    const response = await fetch("./src/scripts/cards.json");
    const data = await response.json();
    const wordsArr = data[cardId].words;
    console.log(wordsArr);

    const cardsContainer = document.querySelector(".cards-container");
    console.log(cardsContainer);
    cardsContainer.innerHTML = "";

    wordsArr.forEach((item) => {
      const cardsWrapper = new ElementBuilder("div")
        .setAttribute("class", "card_container")
        .build();

      const cardElem = new ElementBuilder("div")
        .setAttribute("class", "card")
        .build();

      cardsContainer.appendChild(cardsWrapper);
      cardsWrapper.appendChild(cardElem);

      const cardFace = new ElementBuilder("div")
        .setAttribute("class", "card_face")
        .build();

      cardElem.appendChild(cardFace);

      const cardImage = new ElementBuilder("div")
        .setAttribute("class", "card_image")
        .build();

      cardFace.appendChild(cardImage);

      const imageTag = new ElementBuilder("img").build();
      imageTag.src = item.img;
      imageTag.alt = item.en;

      cardImage.appendChild(imageTag);

      const cardInfo = new ElementBuilder("div")
        .setAttribute("class", "card_info")
        .build();
      const changeMode = document.getElementById("app_mode_input");
      if (changeMode.checked) {
        cardInfo.setAttribute("class", "card_info play-mode");
      }

      cardFace.appendChild(cardInfo);

      const infoBtn = new ElementBuilder("div")
        .setAttribute("class", "info_btn")
        .build();

      cardInfo.appendChild(infoBtn);

      const spanBtn = new ElementBuilder("span")
        .setAttribute("class", "icon_btn info")
        .build();

      infoBtn.appendChild(spanBtn);

      const infoTitle = new ElementBuilder("div")
        .setAttribute("class", "info_title")
        .text(`${item.en}`)
        .build();

      cardInfo.appendChild(infoTitle);

      const soundBtn = new ElementBuilder("div")
        .setAttribute("class", "sound_btn")
        .build();

      cardInfo.appendChild(soundBtn);

      const spanSound = new ElementBuilder("span")
        .setAttribute("class", "icon_btn")
        .setAttribute("data-sound", `${item.sound}`)
        .build();

      soundBtn.appendChild(spanSound);

      const cardBack = new ElementBuilder("div")
        .setAttribute("class", "card_back")
        .build();

      cardElem.appendChild(cardBack);

      const cardBackImage = new ElementBuilder("div")
        .setAttribute("class", "card_image")
        .build();

      cardBack.appendChild(cardBackImage);

      const cardBackImgTag = new ElementBuilder("img").build();

      cardBackImage.appendChild(cardBackImgTag);

      cardBackImgTag.src = item.img;
      cardBackImgTag.alt = item.en;

      const cardBackInfo = new ElementBuilder("div")
        .setAttribute("class", "card_info")
        .build();

      cardBack.appendChild(cardBackInfo);

      const cardBackTitle = new ElementBuilder("div")
        .setAttribute("class", "info_title")
        .text(`${item.ru}`)
        .build();

      cardBackInfo.appendChild(cardBackTitle);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

export function categoryCardClick() {
  const cards = document.querySelectorAll(".category");
  cards.forEach((card) =>
    card.addEventListener("click", async () => {
      const categoryId = card.getAttribute("id");
      console.log(categoryId);
      await createCards(categoryId);
      playMode()
      flipButtons();
      playSound();
    })
  );
}
