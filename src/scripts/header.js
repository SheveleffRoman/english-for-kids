export const burger = document.querySelector('div.burger');

export function toggleMenu() {
    const menu = document.querySelector('ul.menu');
    const blackout = document.querySelector('div.blackout')
    
    burger.addEventListener('click', () => {
        menu.classList.toggle('show')
        burger.classList.toggle('open')
        document.body.classList.toggle('no-scroll')
        blackout.classList.toggle('view')

    })

    blackout.addEventListener('click', () => {
        burger.click()
    })
}

const menuItems = document.querySelectorAll('.menu_item');
const menuLinks = document.querySelectorAll('.menu_link');
const cards = document.querySelectorAll('.category');

// Клик на ссылку
export function handleClick() {
  
  menuItems.forEach(link => link.classList.remove('active'));
  this.parentElement.classList.add('active');
  burger.click();
}

// Клик на карточку
export function handleCardClick() {

  
  // Получаем id ссылки, на которую ссылается карточка
  const linkId = this.querySelector('a').getAttribute('href');
//   console.log(linkId);
  
  // Находим ссылку в меню по id
  const correspondingLink = document.querySelector(`.menu_link[href="${linkId}"]`);
//   console.log(correspondingLink)
  
  menuItems.forEach(item => item.classList.remove('active'));
  correspondingLink.parentElement.classList.add('active');
}

menuLinks.forEach(link => link.addEventListener('click', handleClick));
cards.forEach(card => card.addEventListener('click', handleCardClick));

