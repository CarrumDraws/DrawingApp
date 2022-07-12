import React, { useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm.js";

const generator = rough.generator(); // Generator used for shape generation

// Creates Shapes
function createElement(x1, y1, x2, y2) {
  const roughElement = generator.line(x1, y1, x2, y2);
  return { x1, y1, x2, y2, roughElement };
}

function App() {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);

  // useLayoutEffect is like useEffect but for DOM mutations.
  // Use this if your DOM's appearance changes between its rendering and its mutation.
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const roughCanvas = rough.canvas(canvas); // Declare a rough.canvas

    // rough.canvas.draw appends displays the shape onto the DOM
    // Desturcture 'roughElement' shape out of 'elements' state, draw the shape
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const handleMouseDown = (event) => {
    setDrawing(true);
    const { clientX, clientY } = event; // Starting Point
    const element = createElement(clientX, clientY, clientX, clientY);
    setElements((prevState) => [...prevState, element]);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return; // Ignore normal mouse movement

    const { clientX, clientY } = event; // Ending Point
    const index = elements.length - 1;

    const { x1, y1 } = elements[index]; // get the starting point of the last element...
    const updatedElement = createElement(x1, y1, clientX, clientY); // ...and update its end point

    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement; // Replace the last element.
    setElements(elementsCopy);
  };
  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <canvas
      id="canvas"
      style={{ backgroundColor: "#555555" }}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      Canvas
    </canvas>
  );
}

export default App;
