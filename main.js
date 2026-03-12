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
//
// We store the “name” of the current screen as a string.
// Only one screen should be active at a time.
let currentScreen = "home"; // "home" | "pantry" | "workbench" | "oven" | "recipe"
let bread = 0; // game state variable to track how many breads the player has (starts at 0)
let energy = 90; // game state variable to track the player's energy (starts at 90)
let allimg = []; // global array to store all loaded images (populated in preload())
let font; // global variable to store the loaded font (populated in preload())
let prevScreen = "home";
let video;
let playing = false; // track if the intro video is currently playing
let videoFinished = true; // track if the intro video has finished playing
let ingredientsDone = false; // track if player has collected all ingredients (starts at false, becomes true when they do) --- IGNORE ---

// Ingredient counters (start at 0, increase when player clicks on ingredient in pantry)
let flourCounter = 0;
let waterCounter = 0;
let starterCounter = 0;
let saltCounter = 0;

// Load all images
function preload() {
  for (let i = 0; i < 34; i++) {
    let name = loadImage(`libraries/assets/images/${i}.png`);
    allimg.push(name);
  }

  // Load the intro video
  video = createVideo("libraries/assets/intro.mp4");

  // Load a custom font before the sketch starts
  font = loadFont("libraries/assets/font/playpen.ttf");
}

// ------------------------------
// setup() runs ONCE at the beginning
// ------------------------------
// This is where you usually set canvas size and initial settings.
function setup() {
  createCanvas(1344, 756);
  energy = int(random(70, 98)); // start with random energy between 70 and 98
  // Sets a default font for all text() calls
  // (This can be changed later per-screen if you want.)
  fill(84, 43, 20);
  textFont(font);
  initWorkbench();

  video.hide();
  video.size(width, height);
  video.elt.muted = true; // Allow autoplay by muting the video
  video.onended(() => {
    videoFinished = true;
    currentScreen = "home"; // Ensure we switch to the home screen after the video ends
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

  if (currentScreen === "home") drawHome();
  else if (currentScreen === "pantry") drawPantry();
  else if (currentScreen === "workbench") drawWorkbench();
  else if (currentScreen === "oven") drawOven();
  else if (currentScreen === "recipe") drawRecipe();
  else if (currentScreen === "end") drawEnd();
  else if (currentScreen === "sleep") drawSleep();

  if (currentScreen === "workbench" && prevScreen !== "workbench") {
    initWorkbench();
  }
  prevScreen = currentScreen;

  // Only draw navbar if video has finished playing
  if (videoFinished) {
    drawNavbar();
  }

  if (energy <= 4) {
    currentScreen = "sleep";
  }
}

// ------------------------------
// mousePressed() runs once each time the mouse is clicked
// ------------------------------
// This routes mouse input to the correct screen handler.
function mousePressed() {
  // Each screen *may* define a mouse handler:
  // home.js         → homeMousePressed()
  // pantry.js       → pantryMousePressed()
  // workbench.js     → workbenchMousePressed()
  // oven.js          → ovenMousePressed()
  // recipe.js          → recipeMousePressed()
  // end.js          → endMousePressed()

  if (currentScreen === "home") homeMousePressed();
  else if (currentScreen === "pantry") pantryMousePressed();
  else if (currentScreen === "workbench") workbenchMousePressed();
  else if (currentScreen === "oven") ovenMousePressed();
  else if (currentScreen === "recipe") recipeMousePressed();
  else if (currentScreen === "end") endMousePressed();
  else if (currentScreen === "sleep") sleepMousePressed();

  navbarMousePressed();
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

  if (currentScreen === "home") homeKeyPressed();
  else if (currentScreen === "pantry") pantryKeyPressed();
  else if (currentScreen === "workbench") workbenchKeyPressed();
  else if (currentScreen === "oven") ovenKeyPressed();
  else if (currentScreen === "recipe") recipeKeyPressed();
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
