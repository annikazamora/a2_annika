// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawPantry() → what the pantry screen looks like
// 2) input handlers → how the player returns to the home screen
// 3) helper functions specific to this screen

// ------------------------------
// Main draw function for pantry screen
// ------------------------------
// drawPantry() is called from main.js
// only when currentScreen === "pantry"

function getPantryIngredients() {
  return [
    {
      name: "Starter",
      img: allimg[6],
      x: width / 2 - 160,
      y: height / 2 - 60,
      w: 140,
      h: 140,
      counterName: "starterCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Salt",
      img: allimg[5],
      x: width / 2 - 110,
      y: height / 2 + 170,
      w: 105,
      h: 105,
      counterName: "saltCounter",
      useOpaqueHitbox: true,
    },
    {
      name: "Water",
      x: width * 0.5,
      y: height / 3,
      w: 120,
      h: 180,
      label: "Water",
      counterName: "waterCounter",
      useOpaqueHitbox: false,
    },
    {
      name: "Flour",
      x: width / 2,
      y: height / 3,
      w: 100,
      h: 100,
      label: "Flour",
      counterName: "flourCounter",
      useOpaqueHitbox: false,
    },
  ];
}

function drawPantry() {
  background(240);
  imageMode(CORNER);
  image(allimg[28], 0, 0, width, height);

  const ingredients = getPantryIngredients();

  for (let ingredient of ingredients) {
    if (ingredient.img) {
      const hovering = isMouseOverOpaqueImage(
        ingredient.img,
        ingredient.x,
        ingredient.y,
        ingredient.w,
        ingredient.h,
      );

      tint(hovering ? 150 : 255);
      image(
        ingredient.img,
        ingredient.x,
        ingredient.y,
        ingredient.w,
        ingredient.h,
      );
      noTint();
    } else {
      drawPantryButton(ingredient);
    }

    drawIngredientCounter(ingredient);
  }
}

function pantryMousePressed() {
  const backBtn = { x: width / 2, y: 560, w: 220, h: 70 };

  if (isHover(backBtn)) {
    currentScreen = "home";
    return;
  }

  const ingredients = getPantryIngredients();

  for (let ingredient of ingredients) {
    let clicked = false;

    if (ingredient.useOpaqueHitbox && ingredient.img) {
      clicked = isMouseOverOpaqueImage(
        ingredient.img,
        ingredient.x,
        ingredient.y,
        ingredient.w,
        ingredient.h,
      );
    } else {
      clicked = isHover(ingredient);
    }

    if (clicked) {
      incrementIngredientCounter(ingredient.counterName);
      energy -= int(random(4, 8));
    }
  }
}

function incrementIngredientCounter(counterName) {
  if (counterName === "starterCounter") starterCounter++;
  if (counterName === "saltCounter") saltCounter++;
  if (counterName === "waterCounter") waterCounter++;
  if (counterName === "flourCounter") flourCounter++;
}

function drawIngredientCounter(ingredient) {
  let count = 0;

  if (ingredient.counterName === "starterCounter") count = starterCounter;
  if (ingredient.counterName === "saltCounter") count = saltCounter;
  if (ingredient.counterName === "waterCounter") count = waterCounter;
  if (ingredient.counterName === "flourCounter") count = flourCounter;

  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(
    count,
    ingredient.x + ingredient.w / 2,
    ingredient.y + ingredient.h + 20,
  );
}

function drawPantryButton({ x, y, w, h, label }) {
  rectMode(CORNER);

  const hover = isHover({ x, y, w, h });

  noStroke();
  fill(hover ? color(200, 200, 255, 200) : color(220, 220, 255, 170));
  rect(x, y, w, h, 12);

  fill(0);
  textSize(26);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}
