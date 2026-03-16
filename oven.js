// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawOven() → what the oven screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------------------------------------
// Main draw function for oven screen
// ------------------------------------------------------------
// drawOven() is called from main.js
// only when currentScreen === "oven"
let breadInOven = false;
let bakeTimer = 0; // counts frames while bread is in oven
let bakeDuration = 300; // 5 seconds at 60 FPS
let breadDone = false; // tracks if bread just finished
let warningMessage = "You need to complete all ingredients first!"; // warning if ingredients not ready

let breadDoneTimer = 0; // counts frames after baking finishes
let breadDoneDelay = 200; // show baked bread for 2 seconds (120 frames at 60 FPS)

function drawOven() {
  ovenClosedImg = allimg[12]; // closed oven
  ovenBakingImg = allimg[32]; // open oven
  ovenOpenImg = allimg[2]; // open oven
  breadImg = allimg[7]; // raw bread
  bakedBreadImg = allimg[15]; // baked bread
  ovenBackground = allimg[31]; // oven background

  // ------------------------------
  // Background
  // ------------------------------
  imageMode(CORNER);
  image(ovenBackground, 0, 0, width, height);

  // ------------------------------
  // Title / Instructions
  // ------------------------------
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Click the bread to put it in the oven", width / 2, 80);

  // ------------------------------
  // Oven image
  // ------------------------------
  let ovenY = height / 2 + 120;
  let ovenImg;

  if (breadInOven) {
    ovenImg = ovenBakingImg; // baking image
  } else if (breadDone) {
    ovenImg = ovenOpenImg; // open oven when finished
  } else {
    ovenImg = ovenClosedImg; // closed at start
  }

  imageMode(CENTER);
  let ovenWidth = 550;
  let ovenHeight = 600;
  image(ovenImg, width / 2, ovenY, ovenWidth, ovenHeight);

  // ------------------------------
  // Bread logic
  // ------------------------------
  if (breadInOven) {
    bakeTimer++;
    let secondsLeft = Math.ceil((bakeDuration - bakeTimer) / 60);

    // Show countdown
    textSize(30);
    fill(0);
    text("Baking: " + secondsLeft, width / 2, 200);

    // Finished baking
    if (bakeTimer > bakeDuration) {
      breadInOven = false;
      bakeTimer = 0;
      breadDone = true;
      breadDoneTimer = 0; // reset the delay timer
    }
  } else if (breadDone) {
    // Show baked bread inside oven
    let bakedBreadX = width / 2;
    let bakedBreadY = ovenY + 5;
    image(bakedBreadImg, bakedBreadX, bakedBreadY, 220, 140);

    // Done message
    textSize(50);
    fill(0, 150, 0);
    text("Done!", width / 2, 180);

    // Increment the timer
    breadDoneTimer++;

    // Only go to end screen after the delay
    if (breadDoneTimer > breadDoneDelay) {
      // ~2 seconds at 60 FPS
      bread += 1;
      breadDone = false;
      breadDoneTimer = 0;
      currentScreen = "end"; // go to end screen
    }
  } else {
    // Raw bread on table (before baking)
    let breadX = width / 2 + 300;
    let breadY = ovenY - 20;
    image(breadImg, breadX, breadY, 220, 140);
  }

  screen = "oven";
}

// Mouse input
function ovenMousePressed() {
  let breadX = width / 2 + 300;
  let breadY = height / 2 + 120 - 20;
  let breadW = 220;
  let breadH = 140;

  if (
    mouseX > breadX - breadW / 2 &&
    mouseX < breadX + breadW / 2 &&
    mouseY > breadY - breadH / 2 &&
    mouseY < breadY + breadH / 2
  ) {
    if (ingredientsDone === true) {
      // ingredients are done → bake bread
      breadInOven = true;
      bakeTimer = 0;
      breadDone = false;
      energy -= int(random(4, 10));
    } else if (ingredientsDone === false) {
      // optional: show warning message here
      text(warningMessage, width / 2, height / 2);
    }
  }
}

function ovenKeyPressed() {
  if (key === "r" || key === "R") currentScreen = "start";
}
