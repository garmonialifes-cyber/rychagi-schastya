"use strict";

const levers = ["Тело", "Отдых", "Привычки", "Внимание", "Деньги", "Дело", "Радость", "Отношения", "Смысл"];
const cards = [
  ["Тело и режим", "Что сегодня поможет вам восстановиться?", "Выберите одно посильное действие и назначьте ему время."],
  ["Мысли", "Какая мысль возвращается в похожих ситуациях?", "Запишите одну мысль и ситуацию, в которой она появилась."],
  ["Что можно отпустить", "Какое дело можно упростить или отложить?", "Освободите немного времени для выбранного рычага."],
  ["Другой взгляд", "Какие ещё способы есть у вашей задачи?", "Придумайте второй вариант и сделайте один маленький шаг."],
  ["Что важно мне", "Какой вашей потребности сегодня нужно место?", "Выделите для неё время в календаре."],
  ["Таланты", "За какой помощью к вам обычно обращаются?", "Найдите одну ситуацию, где пригодится ваше умение."],
  ["Направление", "Какое действие вы готовы повторять три недели?", "Зафиксируйте ритуал и признак, по которому заметите перемену."]
];
const pages = { camp: "Базовый лагерь", pass: "Подписка", cards: "Карты сезона", today: "Огоньки", money: "Деньги и опора", next: "Мой итог" };
const seed = { lever: "Отдых", baseline: 4, after: 4, habit: "", card: 1, seen: [], day: 1, log: {}, paid: false, week: 1, money: {}, pointA: "", pointB: "", theme: "light" };
const storageKey = "rychagi-expedition-demo-v1";
const screen = document.querySelector("#screen");
const theme = document.querySelector("#theme");
const notice = document.querySelector("#notice");
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
const pick = (action, n, selected, text, done = false) => `<button type="button" class="pick${done ? " done" : ""}" data-action="${action}" data-value="${esc(n)}" aria-pressed="${selected}">${text}</button>`;
const button = (action, text, klass = "btn") => `<button type="button" class="${klass}" data-action="${action}">${text}</button>`;
const intro = (label, title, description) => `<p class="label">${label}</p><h2 tabindex="-1">${title}</h2><p class="muted">${description}</p>`;
const route = (id, label, title, description) => `<a href="#${id}" class="route"><span class="label">${label}</span><strong>${title}</strong><small>${description}</small></a>`;
const slider = (name, value, label) => `<label class="range-label">${label}<output for="${name}">${value} из 10</output><input type="range" min="1" max="10" id="${name}" value="${value}"></label>`;
const field = (name, label, value, hint) => `<label class="field-label">${label}<input id="${name}" name="${name}" type="text" maxlength="160" value="${esc(value)}" placeholder="${hint}"></label>`;

function start() {
  return `<section class="hero">
    <div class="hero-copy"><p class="label">Игра Гульнары Хакимовой</p><h1 tabindex="-1">Рычаги<br><i>счастья</i></h1>
      <p class="desc">Выберите, что хотите изменить. Найдите одно посильное действие и отмечайте его на пути к своей вершине.</p>
      <div class="hero-actions">${link("camp","Начать бесплатно →","btn gold")}${link("cards","Посмотреть сезон","mutebtn")}</div>
    </div>
    <div class="hero-art" aria-hidden="true"><div class="mount back"></div><div class="mount"></div><div class="trail"></div><div class="camp"></div><div class="mount front"></div><div class="summit"></div>
      <div class="guide"><img src="../gulnara.jpg" alt="">Гульнара Хакимова</div></div>
  </section>
  <div class="route-intro"><h2>Карта маршрута</h2><p>Каждый этап можно открыть сразу.</p></div>
  <div class="routes">
    ${route("camp","Бесплатно","Базовый лагерь","Три дня · свой рычаг и первый шаг")}
    ${route("cards","Сезон · 7 + 21 день","Опора на каждый день","Карты дня · ритуал · огоньки")}
    ${route("money","Сезон · 8 недель","Деньги и опора","Своя цель · план · факт")}
  </div>`;
}

function camp() {
  return intro("Бесплатный маршрут · 3 дня", "Базовый лагерь", "В действующей игре — девять стоянок. Здесь можно сразу выбрать рычаг и попробовать итог первого маршрута.") +
    `<div class="choices" role="group" aria-label="Рычаг">${levers.map(name => pick("lever",name,state.lever === name,name)).join("")}</div>
    <form id="plan-form">
      ${slider("baseline",state.baseline,`Точка А · ${esc(state.lever)}`)}
      <div class="mini">${field("habit","Моё действие на неделю",state.habit,"Например, вечером гуляю 15 минут")}</div>
      <div class="controls"><button class="btn" type="submit">Сохранить план</button>${link("today","К огонькам","mutebtn")}${link("pass","Что откроет подписка","mutebtn")}</div>
      <p class="notice" id="form-note" role="status"></p>
    </form>`;
}

function pass() {
  return intro("Подписка", "Экспедиция", "Когда первый шаг уже выбран, можно продолжить по готовому маршруту сезона.") +
    `<div class="mini"><h3>«Опора на каждый день»</h3><p>7 карточек и 21 день с выбранным ритуалом.</p></div>
     <div class="mini"><h3>«Деньги и опора»</h3><p>8 недель с личной целью и разбором своих шагов.</p></div>
     <div class="mini selected"><h3>990 ₽ в месяц</h3><p>Цена для первого теста. Демо-доступ открывается бесплатно.</p>
     <div class="controls">${state.paid ? link("cards","Доступ открыт · к картам →") : button("show-pass","Попробовать демо подписки")}</div></div>
     <dialog id="pass-dialog" aria-labelledby="pass-title"><h3 id="pass-title">Демо-доступ</h3><p>Подтвердите, чтобы увидеть старт подписки. Платёжных данных здесь нет.</p>
       <div class="controls">${button("unlock","Открыть сезон")}<form method="dialog"><button class="mutebtn">Назад</button></form></div>
     </dialog>`;
}

function cardsScreen() {
  const [title, question, task] = cards[state.card - 1];
  return intro("Опора на каждый день · 7 карточек", "Карты сезона", "Откройте любой день и попробуйте одно действие.") +
    `<div class="choices calendar" role="group" aria-label="День карточки">${cards.map((_, i) => pick("card",i + 1,state.card === i + 1,i + 1,state.seen.includes(i + 1))).join("")}</div>
    <article class="mini"><p class="label">День ${state.card}</p><h3>${title}</h3><p>${question}</p><p>${task}</p></article>
    <div class="controls">${state.seen.includes(state.card) ? '<button class="btn" disabled>Выполнено ✓</button>' : button("seen","Отметить выполненным")}
    ${state.card < cards.length ? button("next-card","Следующая карта →","mutebtn") : link("today","К 21 дню внедрения →")}</div>`;
}

function today() {
  const count = Object.keys(state.log).length;
  return intro("Опора на каждый день · 21 день", "Огоньки", "Выберите день, отметьте действие и посмотрите, как растёт ваш маршрут.") +
    `<div class="choices calendar" role="group" aria-label="День внедрения">${Array.from({length:21},(_,i) => pick("day",i + 1,state.day === i + 1,i + 1,Boolean(state.log[i + 1]))).join("")}</div>
    <form id="day-form"><div class="mini"><p class="label">День ${state.day} · ${count} из 21 с отметкой</p>
      ${field("ritual","Я делаю",state.habit,"Например, 15 минут гуляю после работы")}
      <label class="field-label" for="reflection">Что заметили сегодня?</label>
      <textarea id="reflection" name="reflection" rows="2" maxlength="280" placeholder="Короткая личная запись">${esc(state.log[state.day]?.reflection)}</textarea>
      <div class="controls"><button class="btn" type="submit">${state.log[state.day] ? "Сохранить отметку ✓" : "Зажечь огонёк"}</button>${link("next","Посмотреть итог","mutebtn")}</div>
      <p class="notice" id="form-note" role="status"></p></div></form>`;
}

function money() {
  const week = state.money[state.week] || {};
  return intro("Денежный сезон · 8 недель", "Деньги и опора", "Запишите исходную точку, цель и один шаг на неделю. На демо лучше использовать пример.") +
    `<div class="choices calendar eight" role="group" aria-label="Неделя">${Array.from({length:8},(_,i) => pick("week",i + 1,state.week === i + 1,i + 1,Boolean(state.money[i + 1]))).join("")}</div>
    <form id="money-form"><div class="form-grid">
      ${field("pointA","Точка А",state.pointA,"Например, 2 предложения в неделю")}
      ${field("pointB","Точка Б",state.pointB,"Например, 5 предложений в неделю")}
    </div><div class="mini"><p class="label">Неделя ${state.week} из 8</p><div class="form-grid">
      ${field("step","План",week.step,"Отправить три предложения")}
      ${field("fact","Факт",week.fact,"Отправила два, один ответ")}
    </div><div class="controls"><button class="btn" type="submit">Сохранить неделю</button>${link("next","К моему итогу","mutebtn")}</div>
    <p class="notice" id="form-note" role="status"></p></div></form>`;
}

function next() {
  const count = Object.keys(state.log).length;
  const finance = state.lever === "Деньги" || state.lever === "Дело" || Boolean(state.pointB);
  const product = finance ? "Финансовая психология" : "Переход в 5Д";
  const reason = finance ? "Если хочется разобрать денежную цель и план с Гульнарой, посмотреть программу с обратной связью." : "Если хочется продолжить практики с Гульнарой и разбирать вопросы в сопровождении, посмотреть её программу.";
  return intro("Мой итог", "Что изменилось", `Рычаг «${esc(state.lever)}». Сравните текущую оценку с той, что выбрали в лагере.`) +
    `<div class="meter"><div><span>Точка А</span><b>${state.baseline} / 10</b></div><div><span>Сейчас</span><b id="current-score">${state.after} / 10</b></div><div><span>Огоньки</span><b>${count} / 21</b></div></div>
    ${slider("after",state.after,"Моя оценка сейчас")}
    <div class="mini"><p class="label">Следующий шаг по желанию</p><h3>«${product}»</h3><p>${reason}</p>
      <div class="controls">${button("course","Посмотреть путь в программу","mutebtn")}${link("today","Продолжить игру")}</div></div>
    <dialog id="course-dialog" aria-labelledby="course-title"><h3 id="course-title">«${product}»</h3>
      <p>Здесь участница увидит программу, условия и сможет оставить заявку Гульнаре. В демо можно вернуться в игру.</p>
      <form method="dialog"><button class="mutebtn">Вернуться</button></form>
    </dialog>`;
}

const views = {camp,pass,cards: cardsScreen,today,money,next};
function render(focus = true) {
  const id = location.hash.slice(1);
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

screen.addEventListener("input", ({target}) => {
  if (target.type !== "range") return;
  state[target.id] = Number(target.value);
  target.parentElement.querySelector("output").textContent = `${target.value} из 10`;
  const score = document.querySelector("#current-score");
  if (score) score.textContent = `${target.value} / 10`;
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
  const selector = value === undefined ? `[data-action="${action}"]` : `[data-action="${action}"][data-value="${CSS.escape(value)}"]`;
  if (action === "lever") {
    state.habit = screen.querySelector("#habit").value;
    state.lever = value;
  }
  if (action === "week") {
    state.pointA = screen.querySelector("#pointA").value;
    state.pointB = screen.querySelector("#pointB").value;
  }
  if (["card","day","week"].includes(action)) state[action] = Number(value);
  if (action === "seen") state.seen = [...new Set([...state.seen,state.card])];
  if (action === "next-card") state.card += 1;
  if (action === "unlock") {
    state.paid = true;
    save();
    location.hash = "cards";
    return;
  }
  save();
  render(false);
  const fallback = (action === "seen" || action === "next-card") ? screen.querySelector('.calendar [aria-pressed="true"]') : null;
  (screen.querySelector(selector) || fallback)?.focus({preventScroll:true});
  if (action === "seen") notice.textContent = `День ${state.card} выполнен`;
});

screen.addEventListener("submit", event => {
  const form = event.target;
  if (!["plan-form","day-form","money-form"].includes(form.id)) return;
  event.preventDefault();
  const fields = Object.fromEntries(new FormData(form));
  if (form.id === "plan-form") state.habit = fields.habit.trim();
  if (form.id === "day-form") {
    state.habit = fields.ritual.trim();
    state.log[state.day] = {reflection:fields.reflection.trim()};
  }
  if (form.id === "money-form") {
    state.pointA = fields.pointA.trim();
    state.pointB = fields.pointB.trim();
    state.money[state.week] = {step:fields.step.trim(),fact:fields.fact.trim()};
  }
  save();
  render(false);
  const status = screen.querySelector("#form-note");
  status.textContent = form.id === "day-form" ? "Огонёк зажжён. Запись сохранена." : "Сохранено в демо на этом устройстве.";
  screen.querySelector(`#${form.id} button[type=submit]`)?.focus({preventScroll:true});
});

window.addEventListener("hashchange", () => render());
updateTheme();
render(false);
