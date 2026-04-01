// ------------------------------------------------------------
// main.js = the "router" (traffic controller) for the whole game
// ------------------------------------------------------------
//
// Idea: this project has multiple screens (start, instructions, game, win, lose).
// Instead of putting everything in one giant file, each screen lives in its own
// file and defines two main things:
//   1) drawX()         -> how that screen looks
//   2) XMousePressed() / XKeyPressed() -> how that screen handles input
//
// This main.js file does 3 important jobs:
//   A) stores the current screen in a single shared variable
//   B) calls the correct draw function each frame
//   C) sends mouse/keyboard input to the correct screen handler

// ------------------------------
// Global game state
// ------------------------------
let currentScreen = "splash"; // "home" | "pantry" | "workbench" | "oven" | "recipe"
let bread = 0;
let energy = 90;
let day = 1;
let money = 10;
let game = false;
let daytimer = 250; // timer to show the day 1 image for a few seconds before showing the home screen

// Design
let allimg = [];
let font;
let prevScreen = "home";
let video;
let openday;
let playing = false;
let videoFinished = true;
let ingredientsDone = false;

// Tutorial popups
let tut;
let tut2;
let tut3;
let inst = false;
let recp = false;
let pan = false;
let work = false;
let ovn = false;
let shop = false;
let eng = false;

// Ingredient counters
let flourCounter = 0;
let waterCounter = 0;
let starterCounter = 0;
let saltCounter = 0;

let appleCounter = 0;
let blueberryCounter = 0;
let cinnamonCounter = 0;
let sugarCounter = 0;
let tomatoCounter = 0;

// Recipe / progression helpers
let recipePage = 0;
const LAST_RECIPE_PAGE = 3;
let recipeClicked = false;

// Sound effects
let ambiance;
let cash;
let click;
let ding;
let swoosh;
let timer;
let trash;

let Flour;
let Water;
let Starter;
let Salt;
let Kneading;

function preload() {
  // Load all images
  for (let i = 0; i < 55; i++) {
    let name = loadImage(`libraries/assets/images/${i}.png`);
    allimg.push(name);
  }

  // Load videos
  video = createVideo("libraries/assets/intro.mp4");
  openday = createVideo("libraries/assets/day.mp4");

  // Load general audio
  ambiance = loadSound("libraries/assets/audio/ambiance.mp3");
  cash = loadSound("libraries/assets/audio/cash.mp3");
  click = loadSound("libraries/assets/audio/click.mp3");
  ding = loadSound("libraries/assets/audio/ding.mp3");
  swoosh = loadSound("libraries/assets/audio/swoosh.mp3");
  timer = loadSound("libraries/assets/audio/timer.mp3");
  trash = loadSound("libraries/assets/audio/trash.mp3");

  // Load workbench audio
  Flour = loadSound("libraries/assets/audio/Flour.mp3");
  Water = loadSound("libraries/assets/audio/Water.mp3");
  Starter = loadSound("libraries/assets/audio/Starter.mp3");
  Salt = loadSound("libraries/assets/audio/Salt.mp3");
  Kneading = loadSound("libraries/assets/audio/Kneeding_Dough.mp3");

  // Font
  font = loadFont("libraries/assets/font/playpen.ttf");
}

// ------------------------------
// setup() runs ONCE at the beginning
// ------------------------------
function setup() {
  createCanvas(1344, 756);
  energy = int(random(70, 98));
  fill(84, 43, 20);
  textFont(font);

  initWorkbench();

  openday.size(width, height);
  openday.elt.muted = true;
  openday.stop();
  openday.hide();

  video.hide();
  video.size(width, height);
  video.elt.muted = true;
  video.onended(() => {
    videoFinished = true;
    currentScreen = "home";
  });
}

// ------------------------------
// draw() runs every frame
// ------------------------------
function draw() {
  if (currentScreen === "splash") drawSplash();
  else if (currentScreen === "instructions") drawInstructions();
  else if (currentScreen === "home") drawHome();
  else if (currentScreen === "popup") drawPopup();
  else if (currentScreen === "pantry") drawPantry();
  else if (currentScreen === "workbench") drawWorkbench();
  else if (currentScreen === "oven") drawOven();
  else if (currentScreen === "recipe") drawRecipe();
  else if (currentScreen === "shop") drawShop();
  else if (currentScreen === "end") drawEnd();
  else if (currentScreen === "sleep") drawSleep();

  if (videoFinished && game === true) {
    drawNavbar();
  }

  if (energy <= 4) {
    currentScreen = "sleep";
  }
}

// ------------------------------
// mousePressed() routes click input
// ------------------------------
function mousePressed() {
  userStartAudio();

  // Let splash work normally so the game can start
  if (currentScreen === "splash") {
    splashMousePressed();
    return;
  }

  // Prevent early clicks on the day intro/home overlay from hitting navbar buttons
  if (currentScreen === "home" && daytimer > 0) {
    return;
  }

  if (currentScreen === "instructions") instructionsMousePressed();
  else if (currentScreen === "home") homeMousePressed();
  else if (currentScreen === "popup") popupMousePressed();
  else if (currentScreen === "pantry") pantryMousePressed();
  else if (currentScreen === "workbench") workbenchMousePressed();
  else if (currentScreen === "oven") ovenMousePressed();
  else if (currentScreen === "recipe") recipeMousePressed();
  else if (currentScreen === "shop") shopMousePressed();
  else if (currentScreen === "end") endMousePressed();
  else if (currentScreen === "sleep") sleepMousePressed();

  if (!(currentScreen === "home" && daytimer > 0)) {
    navbarMousePressed();
  }
}

// ------------------------------
// keyPressed() routes keyboard input
// ------------------------------
function keyPressed() {
  if (currentScreen === "splash") splashKeyPressed();
  else if (currentScreen === "instructions") instructionsKeyPressed();
  else if (currentScreen === "home") homeKeyPressed();
  else if (currentScreen === "popup") popupKeyPressed();
  else if (currentScreen === "pantry") pantryKeyPressed();
  else if (currentScreen === "workbench") workbenchKeyPressed();
  else if (currentScreen === "oven") ovenKeyPressed();
  else if (currentScreen === "recipe") recipeKeyPressed();
  else if (currentScreen === "shop") shopKeyPressed();
  else if (currentScreen === "end") endKeyPressed();
  else if (currentScreen === "sleep") sleepKeyPressed();

  navbarKeyPressed();
}

function mouseDragged() {
  if (currentScreen === "workbench") workbenchMouseDragged();
}

function mouseReleased() {
  if (currentScreen === "workbench") workbenchMouseReleased();
}

// ------------------------------------------------------------
// Shared helper function: isHover()
// ------------------------------------------------------------
function isHover({ x, y, w, h }) {
  return (
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2
  );
}
