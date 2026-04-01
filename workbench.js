// ------------------------------
// WORKBENCH SCREEN
// ------------------------------
//
// Image assets used (loaded in main.js preload via allimg[]):
//   allimg[31] → background (31.png)
//   allimg[14] → workbench table (14.png)
//   allimg[8]  → empty bowl (8.png)
//   allimg[9]  → bowl with dough (9.png)

// ── Recipes ─────────────────────────────────────────────────────────────────
// Level 1: classic sourdough loaf
const BREAD_RECIPE = { flour: 3, water: 2, starter: 1, salt: 1 };

// Level 2+: enriched milk bread (new unlock)
const MILK_BREAD_RECIPE = { flour: 4, water: 1, starter: 2, salt: 1 };

// Returns the active recipe object based on current level
function wbActiveRecipe() {
  return wbLevel >= 2 ? MILK_BREAD_RECIPE : BREAD_RECIPE;
}

// ── Level thresholds ─────────────────────────────────────────────────────────
// wbLevel is set in wbRefreshLevel() every frame so it always matches `bread`
let wbLevel = 1; // 1, 2, or 3

function wbRefreshLevel() {
  if (bread >= 5) wbLevel = 3;
  else if (bread >= 3) wbLevel = 2;
  else wbLevel = 1;
}

// ── Styling map ─────────────────────────────────────────────────────────────
const INGREDIENT_STYLES = {
  flour: { bg: [245, 225, 185], label: "FLOUR", emoji: "🌾", imgIndex: 11 },
  water: { bg: [180, 220, 255], label: "WATER", emoji: "💧", imgIndex: 13 },
  starter: { bg: [245, 225, 185], label: "STARTER", emoji: "🫙", imgIndex: 6 },
  salt: { bg: [240, 240, 240], label: "SALT", emoji: "🧂", imgIndex: 5 },
};

// ── Workbench state ──────────────────────────────────────────────────────────
// wbContents persists across screen switches so the bowl is never wiped
// when the player navigates away and returns.
let wbIngredients = [];
let wbBowl = {};
let wbContents = {}; // ← NOT reset on re-entry; survives screen changes
let wbDragging = null;
let wbMessage = "";
let wbMessageTimer = 0;
let wbShowRecipe = false;

// Trash-can button geometry (set in drawWorkbench each frame)
let wbTrashBtn = {};

// ── initWorkbench ────────────────────────────────────────────────────────────
// Called ONCE from main.js setup().  Does NOT clear wbContents so the bowl
// survives if the player switches screens mid-bake.
function initWorkbench() {
  wbDragging = null;
  wbMessage = "";
  wbMessageTimer = 0;
  wbShowRecipe = false;
  // wbContents intentionally left untouched here

  wbBowl = { x: width / 2, y: height * 0.43, w: 200, h: 130 };
  _wbRebuildIngredients();
}

// ── Called every time the player ENTERS the workbench screen ─────────────────
// Syncs ingredient counts from the global pantry counters so items collected
// in the pantry immediately appear here.
function wbOnEnter() {
  _wbRebuildIngredients();
}

// Rebuild the ingredient token list from live pantry counters.
// Pantry counters are the single source of truth — they are decremented when
// an ingredient goes into the bowl and restored when the bowl is trashed.
function _wbRebuildIngredients() {
  wbIngredients = [];
  const names = Object.keys(INGREDIENT_STYLES);
  names.forEach((name, i) => {
    const available =
      {
        flour: flourCounter,
        water: waterCounter,
        starter: starterCounter,
        salt: saltCounter,
      }[name] || 0;
    wbIngredients.push({
      name,
      x: 100 + i * 130,
      y: height * 0.8,
      w: 100,
      h: 100,
      count: available,
    });
  });
}

// ── Recipe helpers ───────────────────────────────────────────────────────────
function wbRecipeComplete() {
  const recipe = wbActiveRecipe();
  return Object.entries(recipe).every(
    ([name, needed]) => (wbContents[name] || 0) >= needed,
  );
}

// ── Main draw ────────────────────────────────────────────────────────────────
function drawWorkbench() {
  screen = "workbench";
  wbRefreshLevel();

  // Rebuild ingredient tokens every frame from live pantry counters.
  // This means no matter how the player arrives here (navbar, pantry button,
  // returning from oven, etc.) the tokens always reflect what was collected.
  _wbRebuildIngredients();

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
  if (allimg[14]) image(allimg[14], width / 2, wbImgY, wbImgW, wbImgH);

  // 3. Bowl position
  const counterY = wbImgY - wbImgH * 0.41;
  wbBowl.x = width / 2 - 15;
  wbBowl.y = counterY;
  wbBowl.w = 400;
  wbBowl.h = 260;

  // 4. Bowl image
  imageMode(CENTER);
  const bowlImg = wbRecipeComplete() ? allimg[9] : allimg[8];
  if (bowlImg) {
    image(bowlImg, wbBowl.x, wbBowl.y, wbBowl.w, wbBowl.h);
  } else {
    _drawWbBowlFallback();
  }

  // 5. Bowl contents
  drawWbBowlContents();

  // 6. Recipe card (only if open)
  if (wbShowRecipe) drawWbRecipe();

  // 7. Ingredient tokens
  drawWbIngredients();

  // 8. Bake button
  drawWbBakeButton();

  // 9. Trash-can button
  drawWbTrashButton();

  // 10. Level + bread progress banner
  drawWbLevelBanner();

  // 11. Dragged token
  drawWbDragging();

  // 12. Toast message
  drawWbMessage();

  cursor(wbIsOverIngredient() ? HAND : ARROW);

  if (work == false) {
    tut = "Click on the ingredients   ";
    tut2 = "to combine them in the bowl.";
    tut3 = "";
    prevScreen = currentScreen;
    currentScreen = "popup";
  }
}

// ── Level / progress banner ───────────────────────────────────────────────────
function drawWbLevelBanner() {
  wbRefreshLevel();

  // Goals per level
  const goals = [3, 5, Infinity]; // breads needed to reach next level
  const labels = ["Classic Sourdough", "Milk Bread (lv2)", "Milk Bread (lv3)"];
  const goal = goals[wbLevel - 1];
  const progress =
    wbLevel === 3
      ? "MAX LEVEL"
      : `${bread} / ${goal} 🍞 to Level ${wbLevel + 1}`;

  rectMode(CORNER);
  fill(255, 245, 220, 220);
  stroke(190, 150, 90);
  strokeWeight(1.5);
  rect(10, 10, 260, 56, 8);
  noStroke();

  fill(80, 40, 10);
  textSize(13);
  textAlign(LEFT, TOP);
  text(`Level ${wbLevel}  –  ${labels[wbLevel - 1]}`, 20, 18);

  fill(100, 60, 20);
  textSize(11);
  text(progress, 20, 38);

  rectMode(CORNER);
  imageMode(CORNER);
}

// ── Trash-can button ─────────────────────────────────────────────────────────
function drawWbTrashButton() {
  const w = 260,
    h = 300;
  wbTrashBtn = { x: width - 170, y: height - 220, w, h };
  const hover = isHover(wbTrashBtn);

  // 44.png = closed lid (default), 45.png = open lid (hover)
  const trashImg = hover ? allimg[45] : allimg[44];

  imageMode(CENTER);
  if (trashImg) {
    image(trashImg, wbTrashBtn.x, wbTrashBtn.y, w, h);
  } else {
    // Fallback if PNGs aren't loaded yet
    rectMode(CENTER);
    fill(hover ? color(210, 60, 60) : color(185, 50, 50));
    stroke(130, 20, 20);
    strokeWeight(2);
    rect(wbTrashBtn.x, wbTrashBtn.y, w, h, 10);
    noStroke();
    fill(255);
    textSize(22);
    textAlign(CENTER, CENTER);
    text("🗑️", wbTrashBtn.x, wbTrashBtn.y);
    rectMode(CORNER);
  }

  imageMode(CORNER);
}

// Trash the bowl — ingredients are GONE, player must go back to pantry
function wbTrashBowl() {
  const hadAnything = Object.values(wbContents).some((v) => v > 0);
  if (!hadAnything) {
    wbMessage = "Bowl is already empty!";
    wbMessageTimer = 80;
    return;
  }

  // Ingredients are permanently discarded — NOT returned to pantry.
  // The player must go back to the pantry to collect more.
  wbContents = {};
  _wbRebuildIngredients();

  // Energy penalty for wasting ingredients
  const penalty = floor(random(5, 10));
  energy = max(0, energy - penalty);

  wbMessage = `Ingredients trashed! Go back to the pantry. (-${penalty} ⚡)`;
  wbMessageTimer = 140;
}

// ── Ingredient tokens ─────────────────────────────────────────────────────────
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

  rectMode(CENTER);
  fill(empty ? color(210, 200, 200) : color(232, 185, 185));
  stroke(190, 140, 140);
  strokeWeight(1.5);
  rect(x, y, w + 10, h + 40, 12);
  noStroke();

  imageMode(CENTER);
  if (empty) tint(150, 150, 150);
  else noTint();

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

// ── Bowl contents display ─────────────────────────────────────────────────────
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
    if (img) image(img, ix, y - 10, iconSize, iconSize);
    fill(60, 30, 10);
    noStroke();
    textSize(10);
    textAlign(CENTER, CENTER);
    text(`×${count}`, ix, y + 22);
    ix += spacing;
  }
  imageMode(CORNER);
}

// ── Bowl fallback ─────────────────────────────────────────────────────────────
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

// ── Recipe card ───────────────────────────────────────────────────────────────
function drawWbRecipe() {
  const recipe = wbActiveRecipe();
  const recipeName = wbLevel >= 2 ? "🥛 MILK BREAD" : "🍞 SOURDOUGH";
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
  textSize(12);
  textAlign(CENTER, TOP);
  text(`📋 ${recipeName}`, x + w / 2, y + 10);

  stroke(200, 170, 110);
  strokeWeight(1);
  line(x + 10, y + 30, x + w - 10, y + 30);
  noStroke();

  textSize(11);
  let ty = y + 38;
  for (const [name, needed] of Object.entries(recipe)) {
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

// ── Bake button ───────────────────────────────────────────────────────────────
function drawWbBakeButton() {
  const btn = wbGetBtn();
  const hover = isHover(btn);

  rectMode(CENTER);
  fill(hover ? color(90, 175, 65) : color(70, 150, 50));
  stroke(40, 100, 30);
  strokeWeight(2);
  rect(btn.x, btn.y, btn.w, btn.h, 10);

  imageMode(CENTER);
  if (allimg[18]) image(allimg[18], btn.x - btn.w / 2 + 30, btn.y, 45, 35);

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

// ── Button geometry helpers ───────────────────────────────────────────────────
function wbGetBtn() {
  return { x: width / 2, y: height - 62, w: 220, h: 50 };
}

function wbGetRecipeBtn() {
  return { x: width - 175, y: height - 55, w: 160, h: 42 };
}

// ── Hover helper ──────────────────────────────────────────────────────────────
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

// ── Input handlers ────────────────────────────────────────────────────────────
function workbenchMousePressed() {
  // Trash-can first
  if (isHover(wbTrashBtn)) {
    wbTrashBowl();
    return;
  }

  // Ingredient tokens — click to add one to the bowl
  for (const ing of wbIngredients) {
    if (
      ing.count > 0 &&
      mouseX > ing.x - ing.w / 2 &&
      mouseX < ing.x + ing.w / 2 &&
      mouseY > ing.y - ing.h / 2 &&
      mouseY < ing.y + ing.h / 2
    ) {
      wbContents[ing.name] = (wbContents[ing.name] || 0) + 1;
      ing.count--;

      // Deduct from the global pantry counter — this is the source of truth
      if (ing.name === "flour") flourCounter = max(0, flourCounter - 1);
      else if (ing.name === "water") waterCounter = max(0, waterCounter - 1);
      else if (ing.name === "starter")
        starterCounter = max(0, starterCounter - 1);
      else if (ing.name === "salt") saltCounter = max(0, saltCounter - 1);

      // Reduced energy cost (1–3 instead of 4–8)
      let energyLoss = floor(random(1, 3));
      energy = max(0, energy - energyLoss);

      wbMessage = `Added ${INGREDIENT_STYLES[ing.name].emoji} ${INGREDIENT_STYLES[ing.name].label}! (-${energyLoss} ⚡)`;
      wbMessageTimer = 80;
      return;
    }
  }

  if (isHover(wbGetBtn())) wbCheckRecipe();
  if (isHover(wbGetRecipeBtn())) wbShowRecipe = !wbShowRecipe;
}

function workbenchMouseDragged() {}

function workbenchMouseReleased() {}

function workbenchKeyPressed() {
  if (keyCode === ENTER) wbCheckRecipe();
}

// Pantry counters (flourCounter, waterCounter, etc.) are the single source of
// truth. They are decremented in workbenchMousePressed when an ingredient moves
// into the bowl, and restored in wbTrashBowl when the bowl is cleared.
// _wbRebuildIngredients() reads them directly — no separate sync needed.

// ── Recipe check / bake ───────────────────────────────────────────────────────
function wbCheckRecipe() {
  const recipe = wbActiveRecipe();

  const missing = [];
  const excess = [];

  for (const [name, needed] of Object.entries(recipe)) {
    const have = wbContents[name] || 0;
    if (have < needed) missing.push(INGREDIENT_STYLES[name].label);
    else if (have > needed) excess.push(INGREDIENT_STYLES[name].label);
  }

  // Also fail if the bowl has ingredients NOT in this recipe
  for (const name of Object.keys(wbContents)) {
    if ((wbContents[name] || 0) > 0 && recipe[name] === undefined) {
      excess.push(INGREDIENT_STYLES[name]?.label || name);
    }
  }

  if (missing.length === 0 && excess.length === 0) {
    // ✅ Correct recipe
    ingredientsDone = true;
    wbContents = {}; // Clear bowl for next loaf
    _wbRebuildIngredients();
    currentScreen = "oven";
  } else if (missing.length > 0) {
    wbMessage = `Missing: ${missing.join(", ")}`;
    wbMessageTimer = 140;
  } else {
    // ❌ Wrong amounts — trash penalty
    const penalty = floor(random(4, 8));
    energy = max(0, energy - penalty);
    wbMessage = `Too much: ${excess.join(", ")}  (-${penalty} ⚡)`;
    wbMessageTimer = 140;
  }
}
