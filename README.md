# ROBO School

Лендинг школы робототехники для педагогов начальной школы. Свёрстан по макету из Figma на чистом HTML, CSS и JavaScript — без фреймворков и сборки.

Живая версия: https://ilyasveshnikov.github.io/robo-school/

## Стек

HTML5, CSS3 (Grid, Flexbox, custom properties, `clamp()`), ванильный JS (ES6, IntersectionObserver).

## Что реализовано

Адаптив под три брейкпоинта (1085 / 768 / 560 px). Sticky-хедер со scrollspy, прогресс-бар чтения и кнопка «наверх». Карусель тренеров со scroll-snap, модалки с инфо о тренере, FAQ-аккордеон, анимированные счётчики и появление секций по скроллу. Форма с валидацией и маской телефона. Плюс семантика, состояния фокуса, `prefers-reduced-motion` и SEO-теги (Open Graph, favicon).

## Запуск

Проект статический. Открыть `index.html` напрямую или поднять локальный сервер:

```bash
python3 -m http.server 8000
```

## Структура

```
index.html       разметка
style.css        стили и дизайн-токены
responsive.css   медиа-запросы
script.js        вся интерактивность
images/          картинки и favicon
```

## Деплой

GitHub Pages: Settings → Pages → ветка `main`, папка `/ (root)`.
