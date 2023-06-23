/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import {
  cardsContainer, createCards,
} from './createCategoryCards.js';

import {
  changeMode, flipButtons, playMode, playSound,
} from './interactive.js';

export const burger = document.querySelector('div.burger');

export function toggleMenu() {
  const menu = document.querySelector('ul.menu');
  const blackout = document.querySelector('div.blackout');

  burger.addEventListener('click', () => {
    menu.classList.toggle('show');
    burger.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
    blackout.classList.toggle('view');
  });

  blackout.addEventListener('click', () => {
    burger.click();
  });
}

export const menuItems = document.querySelectorAll('.menu_item');
export const menuLinks = document.querySelectorAll('.menu_link');
export const cards = document.querySelectorAll('.category');

// Клик на ссылку
function handleClick() {
  menuItems.forEach((link) => link.classList.remove('active'));
  this.parentElement.classList.add('active');
  burger.click();
}

// Клик на карточку
function handleCardClick() {
  // Получаем id ссылки, на которую ссылается карточка
  const linkId = this.querySelector('a').getAttribute('href');
  //   console.log(linkId);

  // Находим ссылку в меню по id
  const correspondingLink = document.querySelector(`.menu_link[href="${linkId}"]`);
  //  console.log(correspondingLink)

  menuItems.forEach((item) => item.classList.remove('active'));
  correspondingLink.parentElement.classList.add('active');
}

export function menuClick() {
  menuLinks.forEach((link) => link.addEventListener('click', handleClick));
  menuLinks.forEach((link) => link.addEventListener('click', async () => {
    const url = new URL(link.href);
    const hash = url.hash.slice(1);
    await createCards(hash);
    cardsContainer.classList.remove('table-flex');
    cardsContainer.classList.remove('flex-card');
    changeMode.removeAttribute('disabled');
    changeMode.nextElementSibling.classList.remove('inactive');
    playMode();
    flipButtons();
    playSound();
  }));
  cards.forEach((card) => card.addEventListener('click', handleCardClick));
}
