"use strict";

const practices = {
  rest: ["Силы", "Сделайте паузу", "На минуту отложите телефон и посмотрите в окно. Затем отметьте, что заметили."],
  time: ["Время для себя", "Найдите 10 минут для себя", "Посмотрите на свой день. Выберите время и поставьте в календарь короткую паузу для себя."],
  money: ["Деньги и дело", "Назовите один денежный вопрос", "Вспомните вопрос о деньгах, который откладывали. Сформулируйте одно действие, которое можете сделать на этой неделе."]
};
const checkpoints = [
  ["Подъём", "В рабочем приложении девять стоянок по трём сферам — Тело, Ум и Душа. В конце вы увидите своё колесо счастья."],
  ["Лагерь", "Из трёх зон роста выберите главную и составьте первый план действий."],
  ["Вершина", "На вершине вас ждёт медитация Гульнары. Итог маршрута, выбранный рычаг и план собираются в Паспорт счастья."]
];
const pages = { camp: "Бесплатная проба", pass: "Рычаги счастья", trail: "Три дня игры", next: "Следующая программа" };
const seed = { theme: "light", practice: "", observation: "", paid: false, day: 1, finished: false, direction: "" };
const storageKey = "rychagi-first-step-v2";
const screen = document.querySelector("#screen");
const theme = document.querySelector("#theme");
let state = { ...seed };
try { state = { ...state, ...JSON.parse(localStorage.getItem(storageKey)) }; } catch {}

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
}

function esc(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value ?? "").replace(/[&<>"']/g, character => entities[character]);
}

const link = (id, title, klass = "btn") => `<a class="${klass}" href="#${id}">${title}</a>`;
const pick = (action, value, selected, text) => `<button type="button" class="pick" data-action="${action}" data-value="${value}" aria-pressed="${selected}">${text}</button>`;
const button = (action, text, klass = "btn") => `<button type="button" class="${klass}" data-action="${action}">${text}</button>`;
const intro = (label, title, description) => `<p class="label">${label}</p><h2 tabindex="-1">${title}</h2><p class="muted">${description}</p>`;
const route = (id, label, title, description) => `<a href="#${id}" class="route"><span class="label">${label}</span><strong>${title}</strong><small>${description}</small></a>`;

function start() {
  return `<section class="hero">
    <div class="hero-copy"><p class="label">Практика Гульнары Хакимовой</p><h1 tabindex="-1">Ваш<br><i>первый шаг</i></h1>
      <p class="desc">Выберите, что сейчас важно. Попробуйте одно действие и посмотрите, куда можно двигаться дальше.</p>
      <div class="hero-actions">${link("camp","Сделать первый шаг →","btn gold")}${link("pass","О трёхдневной игре","mutebtn")}</div>
    </div>
    <div class="hero-art" aria-hidden="true"><div class="mount back"></div><div class="mount"></div><div class="trail"></div><div class="camp"></div><div class="mount front"></div><div class="summit"></div>
      <div class="guide"><img src="../gulnara.jpg" alt="">Гульнара Хакимова</div></div>
  </section>
  <div class="route-intro"><h2>Карта маршрута</h2></div>
  <div class="routes">
    ${route("camp","Бесплатно","Первый шаг","Одна тема · одно действие · ваш итог")}
    ${route("pass","Разовая покупка","Рычаги счастья","Три дня · девять стоянок · Паспорт счастья")}
    ${route("next","После игры","Программа с Гульнарой","Продолжение по вашему запросу")}
  </div>`;
}

function camp() {
  const practice = practices[state.practice];
  const observations = ["Стало понятнее", "Пока без изменений", "Хочу попробовать ещё"];
  return intro("Бесплатная проба", "Что сейчас важно для вас?", "Выберите одну тему. Пройдите короткую практику в своём темпе.") +
    `<div class="choices" role="group" aria-label="Тема">${Object.entries(practices).map(([id,[name]]) => pick("practice",id,state.practice===id,name)).join("")}</div>` +
    (practice ? `<article class="mini"><h3>${practice[1]}</h3><p>${practice[2]}</p>
      <div class="choices" role="group" aria-label="Что вы заметили?">${observations.map((name,i) => pick("observation",i,state.observation===name,name)).join("")}</div></article>` : "") +
    (state.observation ? `<div class="mini selected"><p class="label">Ваш итог</p><h3>${esc(practice[0])}</h3><p>${esc(state.observation)}. К этой практике можно вернуться в любое время.</p>
      <div class="controls">${link("pass","Посмотреть «Рычаги счастья» →")}</div></div>` : "");
}

function pass() {
  return intro("Трёхдневная игра", "Рычаги счастья", "Пройдите девять стоянок, соберите колесо счастья и выберите, в каких сферах хотите что-то изменить.") +
    `<div class="mini"><h3>Что вы заберёте с собой</h3><p>План действий и Паспорт счастья. После финиша можно отмечать шаги и вернуться к повторному замеру.</p></div>
      <div class="mini selected"><h3>Около 3 000 ₽</h3><p>Разовая оплата. Цена предварительная. В демо можно посмотреть все три дня.</p>
      <div class="controls">${state.paid ? link("trail","Продолжить просмотр →") : button("show-pass","Посмотреть платный маршрут")}</div></div>
      <dialog aria-labelledby="pass-title"><h3 id="pass-title">Демонстрационный доступ</h3><p>Откройте три дня игры в режиме просмотра.</p>
        <div class="controls">${button("unlock","Открыть маршрут")}<form method="dialog"><button class="mutebtn">Назад</button></form></div>
      </dialog>`;
}

function trail() {
  if (!state.paid) return intro("Предпросмотр", "Три дня игры", "Откройте демо-доступ, чтобы посмотреть стоянки, лагерь и вершину.") + `<div class="controls">${link("pass","К условиям игры →")}</div>`;
  const [title, description] = checkpoints[state.day - 1];
  return intro("Рычаги счастья", "Три дня игры", "В режиме показа все дни доступны сразу.") +
    `<div class="choices" role="group" aria-label="День игры">${checkpoints.map((_,i) => pick("day",i+1,state.day===i+1,`День ${i+1}`)).join("")}</div>
    <article class="mini"><h3>${title}</h3><p>${description}</p></article>
    <div class="controls">${state.day < 3 ? button("advance","Следующий день →") : button("finish","Посмотреть следующий шаг →")}</div>`;
}

function next() {
  if (!state.finished) return intro("После игры", "Что дальше?", "В конце «Рычагов счастья» вы сможете выбрать, с каким запросом хотите продолжить.") + `<div class="controls">${link(state.paid ? "trail" : "pass","Открыть маршрут →")}</div>`;
  const programs = {
    main: ["Богатые и счастливые", "Основное продолжение после игры. Подойдёт, если хотите работать с выбранным рычагом и своим жизненным планом."],
    money: ["Финансовая психология", "Можно обсудить с Гульнарой, если хотите работать с конкретной денежной целью или вопросом в бизнесе."],
    practice: ["Переход в 5Д", "Можно обсудить с Гульнарой, если хотите продолжить авторские практики и внедрять их с поддержкой."]
  };
  const product = programs[state.direction];
  return intro("После игры", "С чем хотите продолжить?", "Выберите, какой формат помощи сейчас вам ближе. Свой план можно продолжать и самостоятельно.") +
    `<div class="choices" role="group" aria-label="Продолжение">${pick("direction","main",state.direction==="main","Продолжить свой маршрут")}${pick("direction","money",state.direction==="money","Разобрать деньги и дело")}${pick("direction","practice",state.direction==="practice","Продолжить практики")}</div>` +
    (product ? `<article class="mini selected"><h3>«${product[0]}»</h3><p>${product[1]}</p><div class="controls">${button("course","Посмотреть следующий шаг","mutebtn")}</div></article>
    <dialog aria-labelledby="course-title"><h3 id="course-title">«${product[0]}»</h3><p>На этом экране участница увидит описание программы и сможет запросить условия у команды Гульнары. Сейчас открыт демонстрационный просмотр.</p><form method="dialog"><button class="mutebtn">Вернуться к итогу</button></form></dialog>` : "");
}

const views = {camp,pass,trail,next};
const legacy = { cards: "trail", today: "trail", money: "next" };
function render(focus = true) {
  const hash = location.hash.slice(1);
  const id = Object.hasOwn(legacy, hash) ? legacy[hash] : hash;
  if (!Object.hasOwn(views,id)) screen.innerHTML = start();
  else {
    const nav = Object.entries(pages).map(([key,title]) =>
      `<a class="navbtn" href="#${key}" ${key === id ? 'aria-current="page"' : ""}>${title}</a>`
    ).join("");
    screen.innerHTML = `<div class="stage"><nav class="rail" aria-label="Этапы игры">${nav}</nav><section class="panel">${views[id]()}</section></div>`;
  }
  if (focus) {
    window.scrollTo({top:0,behavior:"instant"});
    screen.querySelector("h1,h2")?.focus({preventScroll:true});
  }
}

function updateTheme() {
  const dark = state.theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  theme.textContent = dark ? "☀" : "☾";
  theme.setAttribute("aria-label",dark ? "Включить светлую тему" : "Включить тёмную тему");
}
theme.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  updateTheme();
  save();
});

screen.addEventListener("click", event => {
  const control = event.target.closest("button[data-action]");
  if (!control) return;
  const { action, value } = control.dataset;
  if (action === "show-pass" || action === "course") {
    screen.querySelector("dialog").showModal();
    return;
  }
  if (action === "practice" && state.practice !== value) {
    state.practice = value;
    state.observation = "";
  }
  if (action === "observation") state.observation = control.textContent;
  if (action === "day") state.day = Number(value);
  if (action === "advance") state.day += 1;
  if (action === "direction") state.direction = value;
  if (action === "unlock") state.paid = true;
  if (action === "finish") state.finished = true;
  save();
  if (action === "unlock" || action === "finish") {
    location.hash = action === "unlock" ? "trail" : "next";
    return;
  }
  render(false);
  const selector = action === "advance"
    ? '[data-action="day"][aria-pressed="true"]'
    : `[data-action="${action}"][data-value="${CSS.escape(value)}"]`;
  screen.querySelector(selector)?.focus({preventScroll:true});
});

window.addEventListener("hashchange", () => render());
updateTheme();
render(false);
