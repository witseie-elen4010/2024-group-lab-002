function fetchLoggedInUsers() {
  fetch("/loggedInUsers")
    .then((response) => response.json())
    .then((data) => {
      const loggedInUsersTable = document.getElementById("loggedInUsersTable");
      data.forEach((user) => {
        const row = loggedInUsersTable.insertRow(-1);
        const cell = row.insertCell(0);
        cell.textContent = user.displayName;
      });
    });
}

let canvas;
let context;

function initializeCanvas() {
  canvas = document.getElementById("drawingCanvas");
  context = canvas.getContext("2d");
}

function addEventListeners() {
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", endDrawing);
  canvas.addEventListener("mouseout", endDrawing);

  document.getElementById("clearBtn").addEventListener("click", function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  document.getElementById("leaveBtn").addEventListener("click", function () {
    fetch("/logout").then((response) => {
      if (response.redirected) {
        window.location.href = response.url;
      }
    });
  });

  document
    .getElementById("colorSelect")
    .addEventListener("change", function (e) {
      currentColor = e.target.value;
    });

  document
    .getElementById("thicknessSelect")
    .addEventListener("change", function (e) {
      currentThickness = parseInt(e.target.value);
    });

  document.getElementById("eraserBtn").addEventListener("click", function () {
    isErasing = !isErasing;
    document.getElementById("eraserBtn").classList.toggle("active", isErasing);
    if (isErasing) {
      document.getElementById("thicknessSelect").value = "4"; // Set thickness to 4 for eraser
    } else {
      document.getElementById("thicknessSelect").value = "1"; // Reset thickness to default when not erasing
    }
  });

  document
    .getElementById("submitDrawingBtn")
    .addEventListener("click", function () {
      var canvasData = canvas.toDataURL(); // Get the image data from the canvas

      // Open the new page
      var newWindow = window.open("describeDrawing.html");
      // Once the new page is loaded, set the drawing as the source of the image element
      newWindow.onload = function () {
        var imgElement = newWindow.document.getElementById("drawnImage");
        imgElement.src = canvasData;
      };
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

  window.addEventListener("message", handleMessage);

  function handleMessage(event) {
    // Check if the origin of the message is from the display.html page
    if (event.origin !== window.location.origin) {
      return; // Ignore messages from other origins
    }

    // Update the paragraph with the received text input value
    document.getElementById("received-image-description").textContent =
      "Draw a: " + event.data;
  }
}

// const canvas = document.getElementById("drawingCanvas");
// const context = canvas.getContext("2d");

let isDrawing = false;
let currentColor = "black";
let currentThickness = 1;
let isErasing = false;

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function endDrawing() {
  isDrawing = false;
  context.beginPath();
}

function getDrawingAttributes(isErasing, currentColor, currentThickness) {
  const lineWidth = isErasing ? 4 : currentThickness;
  const strokeStyle = isErasing ? "white" : currentColor;

  return { lineWidth, strokeStyle };
}

function draw(e) {
  if (!isDrawing) return;

  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  const { lineWidth, strokeStyle } = getDrawingAttributes(
    isErasing,
    currentColor,
    currentThickness
  );

  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.strokeStyle = strokeStyle;

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);
}

module.exports = {
  fetchLoggedInUsers,
  initializeCanvas,
  addEventListeners,
  getDrawingAttributes,
};
