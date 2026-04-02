// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawHome() → what the home/menu screen looks like
// 2) input handlers → what happens on click / key press on this screen
// 3) a helper function to draw menu buttons

// ------------------------------------------------------------
// Home screen visuals
// ------------------------------------------------------------
// drawHome() is called from main.js only when:
// currentScreen === "home"

function drawHome() {
  if (!videoFinished) {
    // Play the intro video
    if (!playing) {
      video.play();
      playing = true;
    }
    image(video, 0, 0, width, height);
  } else {
    imageMode(CORNER);

    if (daytimer > 0) {
      textSize(40);
      fill(84, 43, 20);
      image(openday, 0, 0, width, height);
      text("DAY " + day, 640, height / 6);
      daytimer--;
    } else {
      game = true;
      openday.stop();

      // Background colour for the home screen
      image(allimg[0], 0, 0, width, height); // background image

      // ---- Title text ----
      fill(255);
      stroke(84, 43, 20);
      strokeWeight(5);
      textSize(30);
      textAlign(CENTER, CENTER);
      text("PANTRY", 345, 190);
      text("WORKBENCH", 700, 300);
      text("OVEN", 1025, 190);

      // ---- Buttons (data only) ----
      // These objects store the position/size/label for each button.
      // Using objects makes it easy to pass them into drawButton()
      // and also reuse the same information for hover checks.
      const pantryBtn = {
        x: 345,
        y: 440,
        w: 370,
        h: 520,
        label: "",
      };

      const workBtn = {
        x: 711,
        y: 544,
        w: 437,
        h: 290,
        label: "",
      };

      const ovenBtn = {
        x: 1025,
        y: 522,
        w: 297,
        h: 345,
        label: "",
      };

      const shopBtn = {
        x: 100,
        y: height - 100,
        w: 100,
        h: 100,
        label: "",
      };

      // Draw all buttons
      drawButton(pantryBtn);
      drawButton(workBtn);
      drawButton(ovenBtn);

      if (day >= 2) {
        drawButton(shopBtn);
        image(allimg[57], 25, height - 150, 125, 125); // shop icon
      }

      // show pantry image when hovered
      imageMode(CENTER);
      if (isHover(pantryBtn)) {
        image(allimg[1], 345, 440, 370, 520);
      } else if (isHover(ovenBtn)) {
        image(allimg[2], 1025, 522, 297, 345);
      } else if (isHover(workBtn)) {
        image(allimg[33], 711, 544, 437, 290);
      }

      // ---- Cursor feedback ----
      // If the mouse is over the buttons, show a hand cursor so the player knows it is clickable.
      const over =
        isHover(workBtn) ||
        isHover(pantryBtn) ||
        isHover(ovenBtn) ||
        isHover(shopBtn);
      cursor(over ? HAND : ARROW);

      if (inst == false) {
        tut = "Click on recipe instructions ";
        tut2 = "to find out what to bake!";
        prevScreen = currentScreen;
        currentScreen = "popup";
      }

      if (
        eng == false &&
        inst == true &&
        recp == true &&
        pan == true &&
        work == true &&
        ovn == true
      ) {
        tut = "Watch your energy carefully,";
        tut2 = "and go to sleep when it gets low!";
        tut3 = "Good luck!";
        prevScreen = currentScreen;
        currentScreen = "popup";
      }
    }
  }
}

// ------------------------------------------------------------
// Mouse input for the home screen
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "home"
function homeMousePressed() {
  // Do nothing if video is still playing
  if (!videoFinished) return;
  let shopBtn;

  // For input checks, we only need x,y,w,h (label is optional)
  const pantryBtn = { x: 345, y: 440, w: 370, h: 520 };
  const workBtn = { x: 711, y: 544, w: 437, h: 290 };
  const ovenBtn = { x: 1025, y: 522, w: 297, h: 345 };

  if (day >= 2) {
    shopBtn = { x: 100, y: height - 100, w: 100, h: 100 };
  }

  // If workbench is clicked, go to the workbench screen
  if (isHover(workBtn)) {
    prevScreen = currentScreen;
    currentScreen = "workbench";
  }
  // If pantry is clicked, go to the pantry screen
  else if (isHover(pantryBtn)) {
    prevScreen = currentScreen;
    currentScreen = "pantry";
  }
  // If OVEN is clicked, go to the oven screen
  else if (isHover(ovenBtn)) {
    prevScreen = currentScreen;
    currentScreen = "oven";
  } else if (day >= 2 && isHover(shopBtn)) {
    prevScreen = currentScreen;
    currentScreen = "shop";
  }
}

// ------------------------------------------------------------
// Helper: drawButton()
// ------------------------------------------------------------
// This function draws a button and changes its appearance on hover.
// It does NOT decide what happens when you click the button.
// That logic lives in homeMousePressed() above.
//
// Keeping drawing separate from input/logic makes code easier to read.
function drawButton({ x, y, w, h, label }, disabled = false) {
  rectMode(CENTER);

  // Check if the mouse is over the button rectangle
  const hover = isHover({ x, y, w, h });

  noStroke();

  // ---- Visual feedback (hover vs not hover) ----
  // This is a common UI idea:
  // - normal state is calmer
  // - hover state is brighter + more “active”
  //
  // We also add a shadow using drawingContext (p5 lets you access the
  // underlying canvas context for effects like shadows).
  if (disabled) {
    fill(200, 200, 200, label ? 255 : 0); // grey for disabled buttons
    drawingContext.shadowBlur = 0; // no shadow for disabled
  } else if (hover) {
    fill(202, 227, 235, label ? 255 : 0); // warm coral on hover, visible for navbar buttons

    // Shadow settings (only when hovered)
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(242, 248, 250);
  } else {
    fill(255, 240, 210, label ? 255 : 0); // soft cream base, visible for navbar buttons

    // Softer shadow when not hovered
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = color(242, 248, 250);
  }

  // Draw the rounded rectangle button
  rect(x, y, w, h, 14);

  // Important: reset shadow so it does not affect other drawings
  drawingContext.shadowBlur = 0;

  // Draw the label text on top of the button
  fill(40, 60, 70);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}
