// ------------------------------
// WORKBENCH SCREEN
// ------------------------------
//
// Image assets used (loaded in main.js preload via allimg[]):
//   allimg[31] → background (31.png)
//   allimg[14] → workbench table (14.png)
//   allimg[8]  → empty bowl (8.png)
//   allimg[9]  → bowl with dough (9.png)

const BREAD_RECIPE = { flour: 3, water: 2, starter: 1, salt: 1 };

const INGREDIENT_STYLES = {
  flour: { bg: [245, 225, 185], label: "FLOUR", emoji: "🌾", imgIndex: 11 },
  water: { bg: [180, 220, 255], label: "WATER", emoji: "💧", imgIndex: 13 },
  starter: { bg: [245, 225, 185], label: "STARTER", emoji: "🫙", imgIndex: 6 },
  salt: { bg: [240, 240, 240], label: "SALT", emoji: "🧂", imgIndex: 5 },
};

let wbIngredients = [];
let wbBowl = {};
let wbContents = {};
let wbDragging = null;
let wbMessage = "";
let wbMessageTimer = 0;
let wbShowRecipe = false;

function initWorkbench() {
  wbContents = {};
  wbDragging = null;
  wbMessage = "";
  wbMessageTimer = 0;
  wbShowRecipe = false;

  wbBowl = { x: width / 2, y: height * 0.43, w: 200, h: 130 };

  wbIngredients = [];
  const names = Object.keys(INGREDIENT_STYLES);
  names.forEach((name, i) => {
    const pantryCount = {
      flour: flourCounter,
      water: waterCounter,
      starter: starterCounter,
      salt: saltCounter,
    };
    wbIngredients.push({
      name,
      x: 100 + i * 130,
      y: height * 0.8,
      w: 100,
      h: 100,
      count: pantryCount[name] || 0,
    });
  });
}

function wbRecipeComplete() {
  return Object.entries(BREAD_RECIPE).every(
    ([name, needed]) => (wbContents[name] || 0) >= needed,
  );
}

function drawWorkbench() {
  currentScreen = "workbench"; // Ensure currentScreen is set to "workbench" when drawing this screen
  screen = "workbench";

  // 1. Background
  imageMode(CORNER);
  if (allimg[31]) {
    image(allimg[31], 0, 0, width, height);
  } else {
    background(220, 210, 205);
  }

  // 2. Workbench table
  imageMode(CENTER);
  const wbImgW = width * 0.72;
  const wbImgH = wbImgW * (9 / 16);
  const wbImgY = height * 0.62;
  if (allimg[14]) {
    image(allimg[14], width / 2, wbImgY, wbImgW, wbImgH);
  }

  // 3. Bowl
  const counterY = wbImgY - wbImgH * 0.41;
  wbBowl.x = width / 2 - 15;
  wbBowl.y = counterY;
  wbBowl.w = 400;
  wbBowl.h = 260;

  imageMode(CENTER);
  const bowlImg = wbRecipeComplete() ? allimg[9] : allimg[8];
  if (bowlImg) {
    image(bowlImg, wbBowl.x, wbBowl.y, wbBowl.w, wbBowl.h);
  } else {
    _drawWbBowlFallback();
  }

  // 4. Bowl contents
  drawWbBowlContents();

  // 5. Recipe card (only if open)
  if (wbShowRecipe) drawWbRecipe();

  // 6. Ingredient tokens
  drawWbIngredients();

  // 7. Bake button
  drawWbBakeButton();

  // 8. Recipe toggle button
  drawWbRecipeBtn();

  // 9. Dragged token
  drawWbDragging();

  // 10. Toast message
  drawWbMessage();

  cursor(wbIsOverIngredient() ? HAND : ARROW);
}

function drawWbIngredients() {
  for (const ing of wbIngredients) {
    if (wbDragging && wbDragging.name === ing.name) continue;
    drawWbToken(ing.x, ing.y, ing.w, ing.h, ing.name, ing.count);
  }
}

function drawWbToken(x, y, w, h, name, count) {
  const style = INGREDIENT_STYLES[name];
  const empty = count <= 0;
  const img = allimg[style.imgIndex];

  // Bowl-coloured background box
  rectMode(CENTER);
  fill(empty ? color(210, 200, 200) : color(232, 185, 185));
  stroke(190, 140, 140);
  strokeWeight(1.5);
  rect(x, y, w + 10, h + 40, 12);
  noStroke();

  imageMode(CENTER);

  if (empty) {
    tint(150, 150, 150);
  } else {
    noTint();
  }

  if (img) {
    image(img, x, y - 10, w, h);
  } else {
    rectMode(CENTER);
    fill(empty ? color(200, 200, 200) : color(...style.bg));
    stroke(empty ? color(170, 170, 170) : color(0, 0, 0, 40));
    strokeWeight(1.5);
    rect(x, y, w, h, 10);
    noStroke();
    fill(empty ? 160 : 60);
    textAlign(CENTER, CENTER);
    textSize(22);
    text(style.emoji, x, y + 5);
    rectMode(CORNER);
  }

  noTint();

  if (!empty) {
    fill(80, 40, 10);
    noStroke();
    textSize(13);
    textAlign(CENTER, CENTER);
    text(`×${count}`, x + w / 2 - 8, y - h / 2 + 10);
  }

  fill(60, 30, 10);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text(style.label, x, y + h / 2 + 10);

  rectMode(CORNER);
  imageMode(CORNER);
}

function drawWbBowlContents() {
  const { x, y } = wbBowl;
  const items = Object.entries(wbContents).filter(([, c]) => c > 0);
  if (items.length === 0) return;

  const iconSize = 40;
  const spacing = iconSize + 10;
  let ix = x - (items.length * spacing) / 2 + spacing / 2;

  imageMode(CENTER);
  for (const [name, count] of items) {
    const style = INGREDIENT_STYLES[name];
    const img = allimg[style.imgIndex];
    if (img) {
      image(img, ix, y - 10, iconSize, iconSize);
    }
    fill(60, 30, 10);
    noStroke();
    textSize(10);
    textAlign(CENTER, CENTER);
    text(`×${count}`, ix, y + 22);
    ix += spacing;
  }
  imageMode(CORNER);
}

function _drawWbBowlFallback() {
  const { x, y, w, h } = wbBowl;
  fill(0, 0, 0, 35);
  noStroke();
  ellipse(x, y + h * 0.5, w + 20, 18);
  fill(232, 215, 195);
  stroke(150, 110, 70);
  strokeWeight(3);
  arc(x, y, w, h, 0, PI, CHORD);
  ellipse(x, y, w, h * 0.28);
  fill(215, 198, 178, 150);
  noStroke();
  ellipse(x, y, w - 20, h * 0.2);
  fill(120, 75, 30);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text("drop ingredients here", x, y + h * 0.58);
}

function drawWbRecipe() {
  const x = width - 200,
    y = 110,
    w = 165,
    h = 215;
  rectMode(CORNER);
  fill(255, 248, 215);
  stroke(190, 150, 90);
  strokeWeight(2);
  rect(x, y, w, h, 8);

  fill(80, 40, 10);
  noStroke();
  textSize(13);
  textAlign(CENTER, TOP);
  text("📋 RECIPE", x + w / 2, y + 10);

  stroke(200, 170, 110);
  strokeWeight(1);
  line(x + 10, y + 30, x + w - 10, y + 30);
  noStroke();

  textSize(11);
  let ty = y + 38;
  for (const [name, needed] of Object.entries(BREAD_RECIPE)) {
    const have = wbContents[name] || 0;
    const done = have >= needed;
    fill(done ? color(50, 140, 50) : color(80, 40, 10));
    textAlign(LEFT, TOP);
    text(
      `${done ? "✓" : "○"} ${INGREDIENT_STYLES[name].emoji} ${INGREDIENT_STYLES[name].label}`,
      x + 10,
      ty,
    );
    fill(done ? color(50, 140, 50) : color(180, 60, 60));
    textAlign(RIGHT, TOP);
    text(`${have}/${needed}`, x + w - 10, ty);
    ty += 40;
  }
}

function drawWbBakeButton() {
  const btn = wbGetBtn();
  const hover = isHover(btn);

  rectMode(CENTER);
  fill(hover ? color(90, 175, 65) : color(70, 150, 50));
  stroke(40, 100, 30);
  strokeWeight(2);
  rect(btn.x, btn.y, btn.w, btn.h, 10);

  imageMode(CENTER);
  if (allimg[18]) {
    image(allimg[18], btn.x - btn.w / 2 + 30, btn.y, 45, 35);
  }

  fill(255);
  noStroke();
  textSize(14);
  textAlign(CENTER, CENTER);
  text("BAKE BREAD!", btn.x + 15, btn.y);

  rectMode(CORNER);
  imageMode(CORNER);
}

function drawWbRecipeBtn() {
  const btn = wbGetRecipeBtn();
  const hover = isHover(btn);
  rectMode(CORNER);
  fill(hover ? color(200, 170, 90) : color(175, 145, 70));
  stroke(130, 100, 40);
  strokeWeight(2);
  rect(btn.x, btn.y, btn.w, btn.h, 10);
  fill(255);
  noStroke();
  textSize(13);
  textAlign(CENTER, CENTER);
  text(
    wbShowRecipe ? "✕ CLOSE RECIPE" : "📋 VIEW RECIPE",
    btn.x + btn.w / 2,
    btn.y + btn.h / 2,
  );
  rectMode(CORNER);
}

function drawWbDragging() {
  if (!wbDragging) return;
  drawWbToken(
    wbDragging.x,
    wbDragging.y,
    90,
    75,
    wbDragging.name,
    wbDragging.count,
  );
}

function drawWbMessage() {
  if (wbMessageTimer <= 0) return;
  wbMessageTimer--;
  const a = map(wbMessageTimer, 0, 60, 0, 255);
  fill(80, 40, 10, a);
  noStroke();
  textSize(15);
  textAlign(CENTER, CENTER);
  text(wbMessage, width / 2, height - 30);
}

function wbGetBtn() {
  return { x: width / 2, y: height - 62, w: 220, h: 50 };
}

function wbGetRecipeBtn() {
  return { x: width - 175, y: height - 55, w: 160, h: 42 };
}

function wbIsOverIngredient() {
  for (const ing of wbIngredients) {
    if (
      ing.count > 0 &&
      mouseX > ing.x - ing.w / 2 &&
      mouseX < ing.x + ing.w / 2 &&
      mouseY > ing.y - ing.h / 2 &&
      mouseY < ing.y + ing.h / 2
    )
      return true;
  }
  return false;
}

function wbInsideBowl(px, py) {
  const { x, y, w, h } = wbBowl;
  const dx = (px - x) / (w / 2);
  const dy = (py - y) / (h / 2 + 30);
  return dx * dx + dy * dy < 1.2;
}

function workbenchMousePressed() {
  for (const ing of wbIngredients) {
    if (
      ing.count > 0 &&
      mouseX > ing.x - ing.w / 2 &&
      mouseX < ing.x + ing.w / 2 &&
      mouseY > ing.y - ing.h / 2 &&
      mouseY < ing.y + ing.h / 2
    ) {
      wbDragging = {
        name: ing.name,
        x: mouseX,
        y: mouseY,
        count: ing.count,
        source: ing,
      };
      return;
    }
  }
  if (isHover(wbGetBtn())) wbCheckRecipe();
  if (isHover(wbGetRecipeBtn())) wbShowRecipe = !wbShowRecipe;
}

function workbenchMouseDragged() {
  if (wbDragging) {
    wbDragging.x = mouseX;
    wbDragging.y = mouseY;
  }
}

function workbenchMouseReleased() {
  if (!wbDragging) return;
  if (wbInsideBowl(mouseX, mouseY)) {
    const name = wbDragging.name;
    wbContents[name] = (wbContents[name] || 0) + 1;
    wbDragging.source.count--;
    wbMessage = `Added ${INGREDIENT_STYLES[name].emoji} ${INGREDIENT_STYLES[name].label}!`;
    wbMessageTimer = 80;
  }
  wbDragging = null;
}

function workbenchKeyPressed() {
  if (keyCode === ENTER) wbCheckRecipe();
}

function wbCheckRecipe() {
  const missing = [],
    excess = [];
  for (const [name, needed] of Object.entries(BREAD_RECIPE)) {
    const have = wbContents[name] || 0;
    if (have < needed) missing.push(INGREDIENT_STYLES[name].label);
    else if (have > needed) excess.push(INGREDIENT_STYLES[name].label);
  }
  if (missing.length === 0 && excess.length === 0) {
    currentScreen = "oven";
    ingredientsDone = true; // set global variable to true so oven screen can check
  } else if (missing.length > 0) {
    wbMessage = `Missing: ${missing.join(", ")}`;
    wbMessageTimer = 140;
  } else {
    wbMessage = `Too much: ${excess.join(", ")}`;
    wbMessageTimer = 140;
  }
}
