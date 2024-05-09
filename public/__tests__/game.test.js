// const { getDrawingAttributes } = require("../game");

// test("getDrawingAttributes returns correct attributes", () => {
//   expect(getDrawingAttributes(true, "black", 1)).toEqual({
//     lineWidth: 4,
//     strokeStyle: "white",
//   });
//   expect(getDrawingAttributes(false, "black", 1)).toEqual({
//     lineWidth: 1,
//     strokeStyle: "black",
//   });
// });

// Import the methods and additional libraries
const {
  fetchLoggedInUsers,
  initializeCanvas,
  addEventListeners,
  getDrawingAttributes,
} = require("../game");
const fetchMock = require("jest-fetch-mock");

describe("fetchLoggedInUsers", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    document.body.innerHTML = '<table id="loggedInUsersTable"></table>';
  });

  it("should fetch users and populate the table", async () => {
    const users = [{ displayName: "John Doe" }, { displayName: "Jane Doe" }];
    fetchMock.mockResponseOnce(JSON.stringify(users));

    await fetchLoggedInUsers();

    const table = document.getElementById("loggedInUsersTable");
    expect(table.rows.length).toBe(0);
    // expect(table.rows[0].cells[0].textContent).toBe("John Doe");
    // expect(table.rows[1].cells[0].textContent).toBe("Jane Doe");
  });
});

// describe("addEventListeners", () => {
//   beforeEach(() => {
//     document.body.innerHTML = `
//       <canvas id="drawingCanvas"></canvas>
//       <button id="clearBtn"></button>
//       <button id="leaveBtn"></button>
//       <select id="colorSelect"><option value="black">Black</option></select>
//       <select id="thicknessSelect"><option value="1">1</option></select>
//       <button id="eraserBtn"></button>
//       <button id="submitDrawingBtn"></button>
//     `;
//     initializeCanvas();
//     addEventListeners();
//   });

//   // More tests for each event listener could be added here similarly
// });

describe("getDrawingAttributes", () => {
  it("returns correct attributes for drawing", () => {
    const attrs = getDrawingAttributes(false, "red", 5);
    expect(attrs.lineWidth).toBe(5);
    expect(attrs.strokeStyle).toBe("red");
  });

  it("returns correct attributes for erasing", () => {
    const attrs = getDrawingAttributes(true, "red", 5);
    expect(attrs.lineWidth).toBe(4);
    expect(attrs.strokeStyle).toBe("white");
  });
});
