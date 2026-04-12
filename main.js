// ------------------------------------------------------------
// main.js = the “router” (traffic controller) for the whole game
// ------------------------------------------------------------
//
// Idea: this project has multiple screens (start, instructions, game, win, lose).
// Instead of putting everything in one giant file, each screen lives in its own
// file and defines two main things:
//   1) drawX()         → how that screen looks
//   2) XMousePressed() / XKeyPressed() → how that screen handles input
//
// This main.js file does 3 important jobs:
//   A) stores the current screen in a single shared variable
//   B) calls the correct draw function each frame
//   C) sends mouse/keyboard input to the correct screen handler

// ------------------------------
// Global game state
// ------------------------------
// This variable is shared across all files because all files run in the same
// global JavaScript scope when loaded in index.html.

// Game state variables
let currentScreen = "splash"; // "home" | "pantry" | "workbench" | "oven" | "recipe"
let bread = 0; // game state variable to track how many breads the player has (starts at 0)
let energy = 10800; // timer for the day, starts at 10800 (3 minutes) and counts down to 0, when it hits 0, the day ends and player goes to sleep screen
let day = 1; // game state variable to track the current day (starts at 1)
let money = 10;
let game = false;
let daytimer = 250; // timer to show the day 1 image for a few seconds before showing the home screen

// Design
let allimg = []; // global array to store all loaded images (populated in preload())
let font; // global variable to store the loaded font (populated in preload())
let prevScreen = "home";
let video;
let openday;
let nightvid;
let playing = false; // track if the intro video is currently playing
let videoFinished = false; // track if the intro video has finished playing
let ingredientsDone = false; // track if player has collected all ingredients (starts at false, becomes true when they do) --- IGNORE ---

// Ingredient counters (start at 0, increase when player clicks on ingredient in pantry)
let flourCounter = 0;
let waterCounter = 0;
let starterCounter = 0;
let saltCounter = 0;
let appleCounter = 0;
let blueberryCounter = 0;
let cinnamonCounter = 0;
let sugarCounter = 0;
let tomatoCounter = 0;
let recipePage = 0;
let currentBreadType = "plain";
let dailyOrders = [];
let recipeNames = ["Plain", "Tomato", "Blueberry", "Apple"];
const LAST_RECIPE_PAGE = 3;
let recipeClicked = false;

// Tutorial popups
let tut;
let tut2;
let tut3;
let inst = false;
let recp = false;
let pan = false;
let work = false;
let ovn = false;
let shp = false;
let eng = false;

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

// Tool upgrades
let pin = false;
let standmixer = false;
let goldenoven = false;

function preload() {
  // Load all images
  for (let i = 0; i < 68; i++) {
    let name = loadImage(`libraries/assets/images/${i}.png`);
    allimg.push(name);
  }

  // Load the intro video
  video = createVideo("libraries/assets/intro.mp4");
  openday = createVideo("libraries/assets/day.mp4");
  nightvid = createVideo("libraries/assets/night.mp4");

  ambiance = loadSound("libraries/assets/audio/ambiance.mp3");
  cash = loadSound("libraries/assets/audio/cash.mp3");
  click = loadSound("libraries/assets/audio/click.mp3");
  ding = loadSound("libraries/assets/audio/ding.mp3");
  swoosh = loadSound("libraries/assets/audio/swoosh.mp3");
  timer = loadSound("libraries/assets/audio/timer.mp3");
  trash = loadSound("libraries/assets/audio/trash.mp3");
  Flour = loadSound("libraries/assets/audio/Flour.mp3");
  Water = loadSound("libraries/assets/audio/Water.mp3");
  Starter = loadSound("libraries/assets/audio/Starter.mp3");
  Salt = loadSound("libraries/assets/audio/Salt.mp3");
  Kneading = loadSound("libraries/assets/audio/Kneeding_Dough.mp3");

  // Load a custom font before the sketch starts
  font = loadFont("libraries/assets/font/playpen.ttf");
}

function getAvailableRecipesForDay() {
  if (day === 1) {
    return [0];
  } else if (day >= 2 && day <= 4) {
    return [0, 1];
  } else {
    return [0, 1, 2, 3];
  }
}

function generateOrdersForDay() {
  let availableRecipes = getAvailableRecipesForDay();
  dailyOrders = [];

  for (let i = 0; i < 3; i++) {
    let randomIndex = floor(random(availableRecipes.length));
    let recipeIndex = availableRecipes[randomIndex];
    dailyOrders.push(recipeIndex);
  }
}

function getRecipeImageIndex(recipeIndex) {
  if (recipeIndex === 0) {
    return 15; // plain sourdough
  } else if (recipeIndex === 1) {
    return 60; // tomato
  } else if (recipeIndex === 2) {
    return 62; // blueberry
  } else if (recipeIndex === 3) {
    return 61; // apple
  }
}

// ------------------------------
// setup() runs ONCE at the beginning
// ------------------------------
// This is where you usually set canvas size and initial settings.
function setup() {
  createCanvas(1344, 756);
  energy = int(random(10000, 10800)); // start with ~3 minutes (10800 frames) of energy
  // Sets a default font for all text() calls
  // (This can be changed later per-screen if you want.)
  fill(84, 43, 20);
  textFont(font);
  initWorkbench();
  generateOrdersForDay(); //NEW

  openday.size(width, height);
  openday.elt.muted = true; // muted to avoid browser autoplay restrictions
  openday.stop();
  openday.hide();

  nightvid.size(width, height);
  nightvid.elt.muted = true;
  nightvid.stop();
  nightvid.hide();

  video.hide();
  video.size(width, height);
  video.elt.muted = true; // Allow autoplay by muting the video
  video.onended(() => {
    videoFinished = true;
    currentScreen = "splash"; // Ensure we switch to the splash screen after the video ends
  });
}

// ------------------------------
// draw() runs every frame (many times per second)
// ------------------------------
// This is the core “router” for visuals.
// Depending on currentScreen, we call the correct draw function.
function draw() {
  // Each screen file defines its own draw function:
  //   home.js         → drawHome()
  //   pantry.js       → drawPantry()
  //   workbench.js     → drawWorkbench()
  //   oven.js          → drawOven()
  //   recipe.js        → drawRecipe()
  //   end.js           → drawEnd()
  //   sleep.js         → drawSleep()
  //   popup.js         → drawPopup()

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

  // Only draw navbar if video has finished playing
  if (videoFinished && game === true) {
    drawNavbar();
  }

  if (energy <= 3 || money >= 400) {
    currentScreen = "sleep";
  }
}

// ------------------------------
// mousePressed() runs once each time the mouse is clicked
// ------------------------------
// This routes mouse input to the correct screen handler.
function mousePressed() {
  userStartAudio();

  if (currentScreen === "splash") {
    splashMousePressed();
    return;
  }

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
// keyPressed() runs once each time a key is pressed
// ------------------------------
// This routes keyboard input to the correct screen handler.
function keyPressed() {
  // Each screen *may* define a key handler:
  // home.js         → homeKeyPressed()
  // pantry.js       → pantryKeyPressed()
  // workbench.js     → workbenchKeyPressed()
  // oven.js          → ovenKeyPressed()
  // recipe.js        → recipeKeyPressed()
  // end.js           → endKeyPressed()
  // popup.js         → popupKeyPressed()

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
//
// Many screens have buttons.
// This helper checks whether the mouse is inside a rectangle.
//
// Important: our buttons are drawn using rectMode(CENTER),
// meaning x,y is the CENTRE of the rectangle.
// So we check mouseX and mouseY against half-width/half-height bounds.
//
// Input:  an object with { x, y, w, h }
// Output: true if mouse is over the rectangle, otherwise false
function isHover({ x, y, w, h }) {
  return (
    mouseX > x - w / 2 && // mouse is right of left edge
    mouseX < x + w / 2 && // mouse is left of right edge
    mouseY > y - h / 2 && // mouse is below top edge
    mouseY < y + h / 2 // mouse is above bottom edge
  );
}
