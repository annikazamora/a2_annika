// ------------------------------
// WORKBENCH SCREEN
// ------------------------------

const BREAD_RECIPE = { water: 2, starter: 1, salt: 1 };

const INGREDIENT_STYLES = {
  water: { bg: [180, 220, 255], label: "WATER", emoji: "💧" },
  starter: { bg: [245, 225, 185], label: "STARTER", emoji: "🫙" },
  salt: { bg: [240, 240, 240], label: "SALT", emoji: "🧂" },
};

let wbIngredients = [];
let wbBowl = {};
let wbContents = {};
let wbDragging = null;
let wbMessage = "";
let wbMessageTimer = 0;

function initWorkbench() {
  wbContents = {};
  wbDragging = null;
  wbMessage = "";
  wbMessageTimer = 0;

  wbBowl = { x: width / 2, y: height / 2 + 20, w: 200, h: 130 };

  wbIngredients = [];
  const names = Object.keys(INGREDIENT_STYLES);
  names.forEach((name, i) => {
    wbIngredients.push({
      name,
      x: 75 + i * 110,
      y: 250,
      w: 90,
      h: 75,
      count: 3,
    });
  });
}

function drawWorkbench() {
  background(240, 225, 200);

  drawWbIngredients();
  drawWbBowl();
  drawWbBowlContents();
  drawWbRecipe();
  drawWbBakeButton();
  drawWbDragging();
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
  rectMode(CENTER);

  // Shadow
  fill(0, 0, 0, 25);
  noStroke();
  rect(x + 3, y + 4, w, h, 10);

  // Body
  fill(empty ? color(200, 200, 200) : color(...style.bg));
  stroke(empty ? color(170, 170, 170) : color(0, 0, 0, 40));
  strokeWeight(1.5);
  rect(x, y, w, h, 10);

  // Text
  noStroke();
  fill(empty ? 160 : 60);
  textAlign(CENTER, CENTER);
  textSize(22);
  text(style.emoji, x, y + 5);
  textSize(10);
  text(style.label, x, y - 20);

  if (!empty) {
    textSize(10);
    fill(80, 40, 10);
    text(`×${count}`, x + w / 2 - 12, y - h / 2 + 10);
  }

  rectMode(CORNER);
}

function drawWbBowl() {
  const { x, y, w, h } = wbBowl;

  // Shadow
  fill(0, 0, 0, 35);
  noStroke();
  ellipse(x, y + h * 0.5, w + 20, 18);

  // Bowl
  fill(232, 215, 195);
  stroke(150, 110, 70);
  strokeWeight(3);
  arc(x, y, w, h, 0, PI, CHORD);
  ellipse(x, y, w, h * 0.28);

  // Inner
  fill(215, 198, 178, 150);
  noStroke();
  ellipse(x, y, w - 20, h * 0.2);

  // Label
  fill(120, 75, 30);
  noStroke();
  textSize(11);
  textAlign(CENTER, CENTER);
  text("drop ingredients here", x, y + h * 0.58);
}

function drawWbBowlContents() {
  const { x, y } = wbBowl;
  const items = Object.entries(wbContents).filter(([, c]) => c > 0);
  if (items.length === 0) return;

  let ix = x - (items.length * 26) / 2 + 13;
  for (const [name, count] of items) {
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text(INGREDIENT_STYLES[name].emoji, ix, y - 8);
    fill(60, 30, 10);
    textSize(9);
    text(`×${count}`, ix, y + 7);
    ix += 26;
  }
}

function drawWbRecipe() {
  const x = width - 200,
    y = 110,
    w = 165,
    h = 175;

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
  rectMode(CORNER);
  fill(hover ? color(90, 175, 65) : color(70, 150, 50));
  stroke(40, 100, 30);
  strokeWeight(2);
  rect(btn.x, btn.y, btn.w, btn.h, 10);
  fill(255);
  noStroke();
  textSize(15);
  textAlign(CENTER, CENTER);
  text("✓ BAKE BREAD!", btn.x + btn.w / 2, btn.y + btn.h / 2);
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
  text(wbMessage, width / 2, height - 60);
}

function wbGetBtn() {
  return { x: width / 2 - 85, y: height - 55, w: 170, h: 42 };
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
  } else if (missing.length > 0) {
    wbMessage = `Missing: ${missing.join(", ")}`;
    wbMessageTimer = 140;
  } else {
    wbMessage = `Too much: ${excess.join(", ")}`;
    wbMessageTimer = 140;
  }
}
