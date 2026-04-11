// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawShop() → what the shop screen looks like
// 2) input handlers → how the player returns to the start screen

// ------------------------------
// Main draw function for shop screen
// ------------------------------
// drawShop() is called from main.js
// only when currentScreen === "shop"
function drawShop() {
  game = true;
  background(235, 223, 226);
  imageMode(CENTER);
  image(allimg[4], width / 2, height / 2, width, height); // shop background image

  const pinBtn = {
    x: width / 2 - 450,
    y: height / 2 - 100,
    w: 250,
    h: 250,
    label: "",
  };

  const standmixerBtn = {
    x: width / 2 - 125,
    y: height / 2 - 100,
    w: 250,
    h: 250,
    label: "",
  };

  const goldenovenBtn = {
    x: width / 2 + 200,
    y: height / 2 - 100,
    w: 250,
    h: 250,
    label: "",
  };

  // Draw all buttons
  drawButton(pinBtn);
  drawButton(standmixerBtn);
  drawButton(goldenovenBtn);

  // Rolling pin
  fill(255, 240, 210);
  rect(
    pinBtn.x + pinBtn.w / 2,
    pinBtn.y + pinBtn.h / 2,
    pinBtn.w,
    pinBtn.h,
    20,
  );
  // Stand mixer
  rect(
    standmixerBtn.x + standmixerBtn.w / 2,
    standmixerBtn.y + standmixerBtn.h / 2,
    standmixerBtn.w,
    standmixerBtn.h,
    20,
  );
  // Golden oven
  rect(
    goldenovenBtn.x + goldenovenBtn.w / 2,
    goldenovenBtn.y + goldenovenBtn.h / 2,
    goldenovenBtn.w,
    goldenovenBtn.h,
    20,
  );

  // Text descriptions
  fill(84, 43, 20);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("CLICK ON ANY TOOL TO PURCHASE IT", width / 2, 200);

  textSize(20);
  text("$10", pinBtn.x + pinBtn.w / 2, pinBtn.y + pinBtn.h + 50);
  text(
    "Reduces energy loss from",
    pinBtn.x + pinBtn.w / 2,
    pinBtn.y + pinBtn.h + 75,
  );
  text("making dough by 5", pinBtn.x + pinBtn.w / 2, pinBtn.y + pinBtn.h + 100);
  text(
    "$75",
    goldenovenBtn.x + goldenovenBtn.w / 2,
    goldenovenBtn.y + goldenovenBtn.h + 50,
  );
  text(
    "Reduces energy loss from",
    goldenovenBtn.x + goldenovenBtn.w / 2,
    goldenovenBtn.y + goldenovenBtn.h + 75,
  );
  text(
    "baking bread by 10",
    goldenovenBtn.x + goldenovenBtn.w / 2,
    goldenovenBtn.y + goldenovenBtn.h + 100,
  );
  text(
    "$50",
    standmixerBtn.x + standmixerBtn.w / 2,
    standmixerBtn.y + standmixerBtn.h + 50,
  );
  text(
    "Reduces energy loss from",
    standmixerBtn.x + standmixerBtn.w / 2,
    standmixerBtn.y + standmixerBtn.h + 75,
  );
  text(
    "making dough by 7",
    standmixerBtn.x + standmixerBtn.w / 2,
    standmixerBtn.y + standmixerBtn.h + 100,
  );

  // Tool images
  image(allimg[55], pinBtn.x + pinBtn.w / 2, pinBtn.y + pinBtn.h / 2, 200, 100); // pin image
  image(
    allimg[49],
    standmixerBtn.x + standmixerBtn.w / 2,
    standmixerBtn.y + standmixerBtn.h / 2,
    200,
    200,
  ); // stand mixer image
  image(
    allimg[46],
    goldenovenBtn.x + goldenovenBtn.w / 2,
    goldenovenBtn.y + goldenovenBtn.h / 2,
    200,
    200,
  ); // golden oven image

  // Disable tools
  fill(0, 0, 0, 150);
  if (pin === true) {
    rect(
      pinBtn.x + pinBtn.w / 2,
      pinBtn.y + pinBtn.h / 2,
      pinBtn.w,
      pinBtn.h,
      20,
    );
  }
  if (day < 3 || standmixer === true) {
    rect(
      standmixerBtn.x + standmixerBtn.w / 2,
      standmixerBtn.y + standmixerBtn.h / 2,
      standmixerBtn.w,
      standmixerBtn.h,
      20,
    );
  }
  if (day < 3 || goldenoven === true) {
    rect(
      goldenovenBtn.x + goldenovenBtn.w / 2,
      goldenovenBtn.y + goldenovenBtn.h / 2,
      goldenovenBtn.w,
      goldenovenBtn.h,
      20,
    );
  }
}

// ------------------------------
// Mouse input for shop screen
// ------------------------------
// Any mouse click returns the player to the start screen
// (no buttons needed for this simple end state)
function shopMousePressed() {
  if (pin === false) {
    const pinBtn = { x: width / 2 - 325, y: height / 2 + 25, w: 250, h: 250 };
    if (isHover(pinBtn) && money >= 10) {
      pin = true;
      money -= 10;
    }
  }

  if (day >= 3 && standmixer === false) {
    const standmixerBtn = {
      x: width / 2,
      y: height / 2 + 25,
      w: 250,
      h: 250,
    };
    if (isHover(standmixerBtn) && money >= 50) {
      standmixer = true;
      money -= 50;
    }
  }

  if (day >= 3 && goldenoven === false) {
    const goldenovenBtn = {
      x: width / 2 + 325,
      y: height / 2 + 25,
      w: 250,
      h: 250,
    };
    if (isHover(goldenovenBtn) && money >= 75) {
      goldenoven = true;
      money -= 75;
    }
  }
}
