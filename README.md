# Vue3 SPA Dashboard

Это SPA-приложение на Vue 3 (Composition API) для визуализации данных из тестового API. Предусмотрены четыре страницы:

* **Доходы** (`/incomes`)
* **Заказы** (`/orders`)
* **Продажи** (`/sales`)
* **Склады** (`/stocks`)

Каждая страница содержит:

* Таблицу с пагинацией (50 записей на страницу)
* График (Chart.js через vue-chartjs) по выбранному полю
* Фильтры по дате и одному дополнительному полю

## Демонстрация

[Demo](https://spa-dashboard-tau.vercel.app/)

## Технологии

* Vue 3 + Composition API
* Vite
* Vue Router 4
* Axios
* Chart.js + vue-chartjs
* CSS (мобильная адаптивность)

## Запуск проекта локально

1. Клонировать репозиторий:

   ```bash
   git clone https://github.com/eugeny11/Spa_Dashboard
   ```
2. Перейти в папку проекта:

   ```bash
   cd vue3-spa-dashboard
   ```
3. Установить зависимости:

   ```bash
   npm install
   ```
4. Запустить dev-сервер:

   ```bash
   npm run dev
   ```
5. Открыть в браузере: `http://localhost:5173`

## Описание страниц

### /incomes (Доходы)

* Фильтр по диапазону дат и мин. количеству
* График количества поступлений по датам
* Таблица: `income_id`, `date`, `quantity`

### /orders (Заказы)

* Фильтр по диапазону дат, мин. скидке и региону
* График числа заказов по датам
* Таблица: `order_id`, `date`, `barcode`, `discount_percent`, `oblast`

### /sales (Продажи)

* Фильтр по диапазону дат, мин. сумме и региону
* График выручки по датам
* Таблица: `sale_id`, `date`, `total_price`, `region_name`

### /stocks (Склады)

* Фильтр по дате и мин. остатку, фильтр по складу
* График остатков на складах
* Таблица: `nm_id`, `date`, `warehouse_name`, `quantity_full`

## Деплой

Проект развернут на бесплатном хостинге: [https://spa-dashboard-tau.vercel.app/](https://spa-dashboard-tau.vercel.app/)

---