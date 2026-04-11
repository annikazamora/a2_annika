// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawSleep() → what the sleep screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------
// Main draw function for instructions screen
// ------------------------------
// drawSleep() is called from main.js
// only when currentScreen === "sleep"
let sleepTimer = 350; // timer to show the sleep screen for a few seconds before going back to home

function drawSleep() {
  game = false;
  background(29, 24, 74);
  fill(255);
  textAlign(CENTER);
  textSize(30);
  imageMode(CENTER);

  if (money >= 400) {
    textAlign(LEFT);
    rectMode(CORNER);
    background(29, 24, 74);
    image(allimg[64], width / 2, height / 2, width, height);
    fill(84, 43, 20);
    rect(40, 40, 640, 170, 20);
    fill(255, 240, 210);
    rect(50, 50, 620, 150, 15);
    fill(84, 43, 20);
    text("Congratulations! You've earned enough", 75, 75);
    text("money to get into culinary school.", 75, 115);
    text("You've mastered the art of balance!", 75, 155);
  } else if (day >= 10) {
    textAlign(LEFT);
    background(29, 24, 74);
    image(allimg[63], width / 2, height / 2, width, height);
    text("You've reached the final day and", 75, 75);
    text("unfortunately, you didn't make enough money.", 75, 115);
    text("Work on balance next time!", 75, 155);
  } else if (energy > 4 && sleepTimer > 0) {
    image(nightvid, width / 2, height / 2, width, height);
    text("One day closer to culinary school!", width / 2, height / 2);
    sleepTimer--;
  } else if (energy <= 4 && sleepTimer > 0) {
    image(nightvid, width / 2, height / 2, width, height);
    text(
      "You are too tired to continue, you'll have to take tomorrow off.",
      width / 2,
      height / 2,
    );
    text(
      "Remember, rest is just as important as working!",
      width / 2,
      height / 2 + 60,
    );
    sleepTimer--;
  } else {
    nightvid.stop();
    currentScreen = "home";
    if (energy <= 4) {
      day = day + 2;
    } else {
      day++;
    }
    energy = energy = int(random(10000, 10800));
    sleepTimer = 350;
    generateOrdersForDay();
    recipePage = 0;
    daytimer = 250;
    flourCounter = 0;
    waterCounter = 0;
    starterCounter = 0;
    saltCounter = 0;
    appleCounter = 0;
    blueberryCounter = 0;
    cinnamonCounter = 0;
    sugarCounter = 0;
    tomatoCounter = 0;
    openday.play();
  }
}

// ------------------------------
// Mouse input for recipe screen
// ------------------------------
function sleepMousePressed() {
  if (day < 10 && money < 400) {
    nightvid.stop();
    currentScreen = "home";
    if (energy <= 4) {
      day = day + 2;
    } else {
      day++;
    }
    energy = int(random(10000, 10800));
    sleepTimer = 350;
    generateOrdersForDay();
    recipePage = 0;
    daytimer = 250;
    flourCounter = 0;
    waterCounter = 0;
    starterCounter = 0;
    saltCounter = 0;
    appleCounter = 0;
    blueberryCounter = 0;
    cinnamonCounter = 0;
    sugarCounter = 0;
    tomatoCounter = 0;
    openday.play();
  }
}
