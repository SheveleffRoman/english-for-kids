export function toggleMenu() {
    const burger = document.querySelector('div.burger');
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