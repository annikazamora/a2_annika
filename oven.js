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

function drawOven() {
  // Green-tinted background
  background(200, 255, 200);

  fill(0);
  textAlign(CENTER, CENTER);

  textSize(30);
  text("Click the bread to put it in the oven", width / 2, 160);

  // Draw oven
  rectMode(CENTER);
  fill(180);
  rect(width / 2, height / 2, 400, 300, 30);

  // Draw bread
  rectMode(CENTER);
  if (breadInOven) {
    fill(200, 120, 50); // darker color while baking
    rect(width / 2, height / 2, 100, 60, 20);

    // Increase timer
    bakeTimer++;

    // Draw countdown in seconds
    let secondsLeft = Math.ceil((bakeDuration - bakeTimer) / 60);
    textSize(30);
    fill(0);
    text("Baking: " + secondsLeft, width / 2, height / 2 - 100);

    // After baking is done
    if (bakeTimer > bakeDuration) {
      breadInOven = false;
      bakeTimer = 0;
      breadDone = true; // mark bread as done
    }
  } else {
    fill(200, 150, 100); // raw bread color
    rect(width / 2 + 300, height / 2, 100, 60, 20);
  }

  // ------------------------------
  // Show "Done!" at the top if bread finished
  // ------------------------------
  if (breadDone) {
    textSize(50);
    fill(0, 150, 0); // green
    text("Done!", width / 2, 30);
    bread = bread + 1; // increase bread count when done
    breadDone = false; // reset "done" message until next time
    currentScreen = "end"; // go to end screen after bread is done
  }
}

// Mouse input
function ovenMousePressed() {
  let breadX = width / 2 + 300;
  let breadY = height / 2;
  let breadW = 100;
  let breadH = 60;

  if (
    mouseX > breadX - breadW / 2 &&
    mouseX < breadX + breadW / 2 &&
    mouseY > breadY - breadH / 2 &&
    mouseY < breadY + breadH / 2
  ) {
    breadInOven = true;
    bakeTimer = 0;
    breadDone = false; // reset "done" message when new bread is baking
    energy = energy - int(random(4, 10));
  } else {
    currentScreen = "start";
  }
}
