import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm.js";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type) {
  const roughElement =
    type === "line"
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { id, x1, y1, x2, y2, type, roughElement }; // New: return 'id' and 'type'
}

const distance = (a, b) =>
  // Pythag Thm : Len between 'a' and 'b'
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const isWithinElement = (x, y, element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    // Check if click is within rectangle boundaries
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else {
    const a = { x: x1, y: y1 }; // Point 1
    const b = { x: x2, y: y2 }; // Point 2
    const c = { x, y }; // Click Coords
    // Check if click is within line boundaries
    // Checks if distance(a->b) == distance(a->c) + distance(b->c)
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < 1;
  }
};

// Loops through elements array, returning the first element that overlaps the click
function getElementAtPosition(x, y, elements) {
  // 'x' 'y' are click coords, elements is array of elements
  return elements.find((element) => isWithinElement(x, y, element));
}

function App() {
  const [tool, setTool] = useState("line"); // New : Curr Tool (selection, line, rect)
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState("none"); // Rename : Curr Action (none, drawing, moving)
  const [selectedElement, setSelectedElement] = useState(null); // New: Curr Selected Ele (null, element)

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const updateElement = (id, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(id, x1, y1, x2, y2, type);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement; // Reset the element in the specific id
    setElements(elementsCopy);
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        setSelectedElement(element);
        setAction("moving");
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState) => [...prevState, element]);
      setAction("drawing");
    }
  };
  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving") {
      const { id, x1, y1, x2, y2, type } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      updateElement(
        id,
        clientX, // New starting points
        clientY, // ^
        width + clientX, // New ending points
        height + clientY, // ^
        type
      );
    }
  };
  const handleMouseUp = () => {
    setAction("none");
    setSelectedElement(null);
  };

  return (
    <div>
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          id="selection"
          checked={tool === "selection"}
          onChange={() => setTool("selection")}
        />
        <label htmlFor="selection">Selection</label>
        <input
          type="radio"
          id="line"
          checked={tool === "line"}
          onChange={() => setTool("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => setTool("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>

      <canvas
        id="canvas"
        style={{ backgroundColor: "#999999" }}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default App;
