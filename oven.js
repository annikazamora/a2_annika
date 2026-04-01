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




let warningMessage = "You need to complete all ingredients first!"; //"You need to complete all ingredients first!"; // warning if ingredients not ready


let breadDoneTimer = 0; // counts frames after baking finishes
let breadDoneDelay = 100; // show baked bread for 2 seconds (120 frames at 60 FPS)
let showWarning = false;


let breadInOven = false;
let breadDone = false;     // perfectly baked
let breadBurnt = false;    // burnt
let bakeTimer = 0;         // counts frames while in oven
let bakeDuration = 300;    // perfect bake time
let burnTime = 420;        // time at which bread burns if left
let showTooEarlyMessage = false; // flag for "not done baking"

let breadReadyForEndScreen = false;
let showClickBreadText;
let minTemp = 180;        // Minimum oven temp
let maxTemp = 250;        // Maximum oven temp
let selectedTemp = 150;   // Current oven temp (default)

function drawOven() {
  // ------------------------------
  // Images
  // ------------------------------
  ovenClosedImg = allimg[12];
  ovenBakingImg = allimg[32];
  ovenOpenImg = allimg[2];
  breadImg = allimg[17];
  bakedBreadImg = allimg[15];
  burntBreadImg = allimg[43];
  ovenBackground = allimg[31];
  counterImg = allimg[48];

  // ------------------------------
  // Determine temperatures based on level
  // ------------------------------
  let temps;
  if (level === 1) temps = [150, 200, 250];
  else if (level === 2) temps = [150, 175, 200, 225];
  else if (level === 3) temps = [150, 175, 200, 225, 250];
  else temps = [150, 200, 250]; // fallback

  // Adjust bakeDuration and burnTime based on selectedTemp
  if (selectedTemp <= 150) {
    bakeDuration = 600;
    burnTime = 600;
  } else if (selectedTemp <= 175) {
    bakeDuration = 480;
    burnTime = 480;
  } else if (selectedTemp <= 200) {
    bakeDuration = 360;
    burnTime = 360;
  } else if (selectedTemp <= 225) {
    bakeDuration = 240;
    burnTime = 240;
  } else {
    bakeDuration = 180;
    burnTime = 180;
  }

  // ------------------------------
  // Background
  // ------------------------------
  imageMode(CORNER);
  image(ovenBackground, 0, 0, width, height);

  // ------------------------------
  // Temperature slider
  // ------------------------------
  let tempX = width / 2 - 400;
  let tempY = height / 2 + 50;
  let tempWidth = 60;
  let tempHeight = 260;

  fill(200);
  rect(tempX, tempY - tempHeight / 2 + 120, tempWidth, tempHeight, 10);

  let bottomY = tempY + tempHeight / 2;
  let topY = tempY - tempHeight / 2;

  for (let i = 0; i < temps.length; i++) {
    let y = map(i, 0, temps.length - 1, bottomY, topY);
    if (selectedTemp === temps[i]) {
      if (selectedTemp <= 150) fill(0, 150, 255);
      else if (selectedTemp <= 175) fill(0, 200, 200);
      else if (selectedTemp <= 200) fill(255, 165, 0);
      else if (selectedTemp <= 225) fill(255, 100, 0);
      else fill(255, 0, 0);
    } else fill(150);
    rect(tempX, y - 10, tempWidth, 20, 10);
  }

  fill(0);
  textSize(20);
  text("Click to set temperature", 260, 250);
  textAlign(CENTER, TOP);
  text(selectedTemp + "°C", tempX, tempY + tempHeight / 2 + 15);

  // ------------------------------
  // Oven
  // ------------------------------
  let ovenY = height / 2 + 120;
  let ovenImg;

  if (breadInOven) ovenImg = ovenBakingImg;
  else if (breadDone || breadBurnt) ovenImg = ovenOpenImg;
  else ovenImg = ovenClosedImg;

  imageMode(CENTER);
  image(ovenImg, width / 2 - 30, ovenY, 550, 600);

  // ------------------------------
  // Counter
  // ------------------------------
  let counterX = width / 2 + 400;
  let counterY = ovenY + 8;
  let targetWidth = 300;
  let aspectRatio = counterImg.height / counterImg.width;
  let targetHeight = targetWidth * aspectRatio;

  image(counterImg, counterX, counterY, targetWidth, targetHeight);

  // ------------------------------
  // Bread position
  // ------------------------------
  let breadX = counterX;
  let breadY = counterY - targetHeight / 1.75;

  // ------------------------------
  // Warning / instructions
  // ------------------------------
  textAlign(CENTER, CENTER);

  if (!ingredientsDone) {
    textSize(28);
    fill(200, 0, 0);
    text(warningMessage, width / 2, 190);
  } else if (!breadInOven && !breadDone && !breadBurnt) {
    textSize(28);
    fill(0);
    text("Click bread to bake!", width / 2, 80);
  }

  // ------------------------------
  // Bread logic
  // ------------------------------
  if (breadInOven) {
    bakeTimer++;

    textSize(30);
    fill(0);
    text("Baking: " + Math.floor(bakeTimer / 60) + "s", width / 2 - 30, 170);

    textSize(28);
    text("Click the bread when finished!", width / 2 - 30, 210);

    if (showTooEarlyMessage) {
      fill(200, 50, 50);
      text("Not done baking!", width / 2 - 30, 115);
    }

    image(bakedBreadImg, width / 2 - 30, ovenY + 35, 220, 140);

  } else if (breadDone || breadBurnt) {

    if (breadDone) {
      image(bakedBreadImg, width / 2 - 30, ovenY + 5, 220, 140);
      textSize(50);
      fill(0, 150, 0);
      text("Done!", width / 2 - 30, 140);
    } else {
      image(burntBreadImg, width / 2 - 30, ovenY + 5, 220, 140);
      textSize(50);
      fill(150, 0, 0);
      text("Burnt!", width / 2 - 30, 140);
    }

    textSize(20);
    fill(0);
    text("Click bread to continue", width / 2 - 30, 205);

    breadReadyForEndScreen = true;

  } else if (ingredientsDone) {
    // Only show raw bread on counter if ingredients are done
    image(breadImg, breadX, breadY, 220, 140);
  }

  // ------------------------------
  // Screen state
  // ------------------------------
  screen = "oven";

  if (ovn == false) {
    tut = "Once the dough is ";
    tut2 = "ready, set the temperature ";
    tut3 = "and click to bake!";
    prevScreen = currentScreen;
    currentScreen = "popup";
  }
}

// Mouse input
function ovenMousePressed() {
  let counterX = width / 2 + 400;
  let ovenY = height / 2 + 120;
  let counterY = ovenY + 8;
  let targetWidth = 300;
  let aspectRatio = counterImg.height / counterImg.width;
  let targetHeight = targetWidth * aspectRatio;
  let breadW = 220;
  let breadH = 140;

  // Bread positions
  let counterBreadX = counterX;
  let counterBreadY = counterY - targetHeight / 1.75;
  let ovenBreadX = width / 2;
  let ovenBreadY = ovenY + 35;

  // Temperature slider
  let tempX = width / 2 - 400;
  let tempY = height / 2 + 50;
  let tempWidth = 60;
  let tempHeight = 250;

  // ------------------------------
  // Click temperature slider
  // ------------------------------
  if (
    mouseX > tempX - tempWidth / 2 &&
    mouseX < tempX + tempWidth / 2 &&
    mouseY > tempY - tempHeight / 2 &&
    mouseY < tempY + tempHeight / 2
  ) {
    let temps;
    if (level === 1) temps = [150, 200, 250];
    else if (level === 2) temps = [150, 175, 200, 225];
    else if (level === 3) temps = [150, 175, 200, 225, 250];
    else temps = [150, 200, 250];

    let currentIndex = temps.indexOf(selectedTemp);
    if (currentIndex === -1) currentIndex = temps.length - 1;

    let nextIndex = (currentIndex + 1) % temps.length;
    selectedTemp = temps[nextIndex];

    console.log("Temperature set to: " + selectedTemp + "°C");
    return;
  }

  // ------------------------------
  // Click raw bread (on counter)
  // ------------------------------
  let clickedCounterBread =
    mouseX > counterBreadX - breadW / 2 &&
    mouseX < counterBreadX + breadW / 2 &&
    mouseY > counterBreadY - breadH / 2 &&
    mouseY < counterBreadY + breadH / 2;

  if (clickedCounterBread) {
    // ------------------------------
    // Prevent baking if ingredients are not ready
    // ------------------------------
    if (!ingredientsDone) {
      showWarning = true;
      return; // stop further execution
    }

    // Ingredients done, hide warning
    showWarning = false;

    breadInOven = true;

    if (!timer.isPlaying()) {
      timer.setVolume(3);
      timer.play();
    }

    bakeTimer = 0;
    breadDone = false;
    breadBurnt = false;
    showTooEarlyMessage = false;
    breadReadyForEndScreen = false;

    energy -= int(random(1, 4));
    return;
  }

  // ------------------------------
  // Click bread in oven
  // ------------------------------
  let clickedOvenBread =
    mouseX > ovenBreadX - breadW / 2 &&
    mouseX < ovenBreadX + breadW / 2 &&
    mouseY > ovenBreadY - breadH / 2 &&
    mouseY < ovenBreadY + breadH / 2;

  if (breadInOven && clickedOvenBread) {
    if (bakeTimer < bakeDuration) {
      showTooEarlyMessage = true;
    } else {
      let burnWindow;
      if (selectedTemp === 150) burnWindow = 200;
      else if (selectedTemp === 175) burnWindow = 180;
      else if (selectedTemp === 200) burnWindow = 180;
      else if (selectedTemp === 225) burnWindow = 150;
      else burnWindow = 120;

      if (bakeTimer >= bakeDuration && bakeTimer <= bakeDuration + burnWindow) {
        breadDone = true;
        money += 10;
        bread += 1;
      } else if (bakeTimer > bakeDuration + burnWindow) {
        breadBurnt = true;
      }

      if (ding && !ding.isPlaying()) {
        ding.setVolume(3);
        ding.play();
      }

      breadInOven = false;

      if (timer.isPlaying()) timer.stop();

      bakeTimer = 0;
      showTooEarlyMessage = false;
      breadReadyForEndScreen = true;
    }
    return;
  }

  // ------------------------------
  // Click finished bread → end screen
  // ------------------------------
  if (breadReadyForEndScreen && clickedOvenBread) {
    currentScreen = "end";

    if (timer.isPlaying()) timer.stop();

    // Reset state
    breadInOven = false;
    breadDone = false;
    breadBurnt = false;
    bakeTimer = 0;
    showTooEarlyMessage = false;
    breadReadyForEndScreen = false;
    return;
  }
}