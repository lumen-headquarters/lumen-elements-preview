import { catalog, createElement, drawElement, type ElementKind } from "../src";

const select = document.querySelector<HTMLSelectElement>("#element")!;
const ratio = document.querySelector<HTMLSelectElement>("#ratio")!;
const textRow = document.querySelector<HTMLLabelElement>("#text-row")!;
const textLabel = document.querySelector<HTMLSpanElement>("#text-label")!;
const text = document.querySelector<HTMLTextAreaElement>("#text")!;
const accent = document.querySelector<HTMLInputElement>("#accent")!;
const canvas = document.querySelector<HTMLCanvasElement>("#preview")!;
const context = canvas.getContext("2d")!;
const time = document.querySelector<HTMLInputElement>("#time")!;
const position = document.querySelector<HTMLOutputElement>("#position")!;
const play = document.querySelector<HTMLButtonElement>("#play")!;

const groups = new Map<string, HTMLOptGroupElement>();
for (const [kind, definition] of Object.entries(catalog)) {
  let group = groups.get(definition.group);
  if (!group) {
    group = document.createElement("optgroup");
    group.label = definition.group;
    select.append(group);
    groups.set(definition.group, group);
  }
  group.append(new Option(definition.name, kind));
}

let element = createElement("el:typescriptlogo");
let playing = false;
let anchor = 0;
let current = 0;
let animation = 0;

function render() {
  const out = { w: canvas.width, h: canvas.height };
  context.fillStyle = "#303c47";
  context.fillRect(0, 0, out.w, out.h);
  drawElement(context, out, element, current);
  time.value = String(current);
  position.value = `${current.toFixed(2)} s`;
}

function playFrame(now: number) {
  current = ((now - anchor) / 1000) % element.end;
  render();
  animation = requestAnimationFrame(playFrame);
}

function resetElement() {
  element = createElement(select.value as ElementKind);
  textRow.hidden = !catalog[element.kind]?.fields.text;
  textLabel.textContent = catalog[element.kind]?.fields.text ?? "Text";
  text.value = element.text;
  accent.value = element.accent ?? "#ffffff";
  current = element.end / 2;
  time.max = String(element.end);
  anchor = performance.now() - current * 1000;
  render();
}

select.value = element.kind;
select.addEventListener("change", resetElement);
ratio.addEventListener("change", () => {
  canvas.width = ratio.value === "portrait" ? 432 : 768;
  canvas.height = ratio.value === "portrait" ? 768 : 432;
  render();
});
text.addEventListener("input", () => {
  element.text = text.value;
  render();
});
accent.addEventListener("input", () => {
  element.accent = accent.value;
  render();
});
time.addEventListener("input", () => {
  current = time.valueAsNumber;
  anchor = performance.now() - current * 1000;
  render();
});
play.addEventListener("click", () => {
  playing = !playing;
  play.textContent = playing ? "Pause" : "Play";
  if (playing) {
    anchor = performance.now();
    animation = requestAnimationFrame(playFrame);
  } else {
    cancelAnimationFrame(animation);
  }
});
document.querySelector("form")!.addEventListener("reset", (event) => {
  event.preventDefault();
  resetElement();
});
resetElement();
void Promise.all([
  document.fonts.load('600 16px "Inter"'),
  document.fonts.load('800 18px "Inter Tight"'),
  document.fonts.load('600 16px "JetBrains Mono"'),
  document.fonts.load('italic 18px "Playfair Display"'),
]).then(render, render);
