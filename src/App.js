import React, { useLayoutEffect, useState } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs/bundled/rough.esm.js";

const generator = rough.generator(); // Declare Generator

// Creates Line
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
    const context = canvas.getContext("2d"); // The context is what we use to render our drawings on to.
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const roughCanvas = rough.canvas(canvas); // Declare a Rough Canvas

    //Create shapes with generator
    // const line = generator.line(80, 120, 300, 100); // x1, y1, x2, y2
    // roughCanvas.draw(line);
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement)); // Desturcture the roughElement out of every element in elements
  }, [elements]);

  const handleMouseDown = (event) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    const element = createElement(clientX, clientY, clientX, clientY);
    setElements((prevState) => [...prevState, element]);
  };
  const handleMouseMove = (event) => {
    if (!drawing) return;

    const { clientX, clientY } = event; // clientX and clientY are relative to the element, NOT the screen
    const index = elements.length - 1;

    const { x1, y1 } = elements[index]; // get the x1 and y1 of the last element- the element created in handleMouseDown...
    const updatedElement = createElement(x1, y1, clientX, clientY); // ...and make a new element with that data.

    const elementsCopy = [...elements]; // Replace the las element with the one yu just created.
    elementsCopy[index] = updatedElement;
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
