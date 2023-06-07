export function createHTMLTag(parentElement = null, tagName, attributes = {}, content = '', where = 'beforeend') {
    const element = document.createElement(tagName);

    // Добавляем произвольные атрибуты: id, class, etc
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }

    // Добавляем произвольный контент
    if (content !== '') {
        element.innerHTML = content;
    }

    // Вставляем элемент после указанного родительского элемента
    if (parentElement !== null) {
        parentElement.insertAdjacentElement(where, element);
    }

    return element;
}