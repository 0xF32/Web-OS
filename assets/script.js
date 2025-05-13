let windowMoveAmount = 100;
let windowResizeAmount = 10;

function init() {
  document.addEventListener("keydown", keydown, false);
  console.log("Init done!");
}

function makeMain(element) {
  console.log("making main: ", element);
  document.querySelectorAll("window").forEach((el) => {
    el.id = "subWindow";
    el.style.setProperty("--z-index", parseInt(getComputedStyle(el).getPropertyValue("--z-index")) - 1)
  });
  element.id = "mainWindow";
  element.style.setProperty("--z-index", 3) // Set to the number of windows when adding a new window #TODO
}

function keydown(e) {
  // Get the window and its style for easy access
  let mainWindow = document.getElementById("mainWindow");
  let mainWindowStyle = getComputedStyle(mainWindow);
  if (e.shiftKey) {
    // Manage resizing the window
    // Left arrow
    if (e.keyCode == 37) {
      let width = parseInt(mainWindowStyle.getPropertyValue("--width"));
      width -= windowResizeAmount;
      width += "px";
      mainWindow.style.setProperty("--width", width);
      console.log("Shift + left arrow down: width =", width);
    }
    // Up Arrow
    if (e.keyCode == 38) {
      let height = parseInt(mainWindowStyle.getPropertyValue("--height"));
      height -= windowResizeAmount;
      height += "px";
      mainWindow.style.setProperty("--height", height);
      console.log("Shift + up arrow down: height =", height);
    }
    // Right Arrow
    if (e.keyCode == 39) {
      let width = parseInt(mainWindowStyle.getPropertyValue("--width"));
      width += windowResizeAmount;
      width += "px";
      mainWindow.style.setProperty("--width", width);
      console.log("Shift + right arrow down: width =", width);
    }
    // Down Arrow
    if (e.keyCode == 40) {
      let height = parseInt(mainWindowStyle.getPropertyValue("--height"));
      height += windowResizeAmount;
      height += "px";
      mainWindow.style.setProperty("--height", height);
      console.log("Shift + down arrow down: height =", height);
    }
  } else {
    // Manage moving the window
    // Left arrow
    if (e.keyCode == 37) {
      let x = parseInt(mainWindowStyle.getPropertyValue("--x"));
      x -= windowMoveAmount;
      x += "px";
      mainWindow.style.setProperty("--x", x);
      console.log("left arrow down: x =", x);
    }
    // Up Arrow
    if (e.keyCode == 38) {
      let y = parseInt(mainWindowStyle.getPropertyValue("--y"));
      y -= windowMoveAmount;
      y += "px";
      mainWindow.style.setProperty("--y", y);
      console.log("up arrow down: y =", y);
    }
    // Right Arrow
    if (e.keyCode == 39) {
      let x = parseInt(mainWindowStyle.getPropertyValue("--x"));
      x += windowMoveAmount;
      x += "px";
      mainWindow.style.setProperty("--x", x);
      console.log("right arrow down: x =", x);
    }
    // Down Arrow
    if (e.keyCode == 40) {
      let y = parseInt(mainWindowStyle.getPropertyValue("--y"));
      y += windowMoveAmount;
      y += "px";
      mainWindow.style.setProperty("--y", y);
      console.log("down arrow down: y =", y);
    }
  }
}

// Get the value of a global css variable
// Nicknamed settings, so that it can be configured
function getCSSSetting(setting) {
  let rootStyle = getComputedStyle(document.querySelector(":root"));
  let value = rootStyle.getPropertyValue(setting);
  return value;
}

// Set the value of a global css variable
function setCSSSetting(setting, value) {
  let root = document.querySelector(":root");
  root.style.setProperty(setting, value);
  console.log(setting, "=", getSetting(setting));
}


// For JavaScript:
// Get the value of a variable
function getJSSetting(setting) {
  return (1, eval)(setting);
}

// Set the value of a variable
function setJSSetting(setting, value) {
  (1, eval)(setting + '=' + value);
  console.log(setting, "=", getJSSetting(setting));
}