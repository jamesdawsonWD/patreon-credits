"use client";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";

const App = () => {
  const generateRandomUsernames = (count: number) => {
    const words = [
      "Cool",
      "Gamer",
      "Epic",
      "Daring",
      "Fab",
      "Hyper",
      "Mystic",
      "Ninja",
      "Wizard",
      "Ace",
      "Nova",
      "Sky",
      "Neo",
      "Quantum",
      "Zen",
      "Frost",
      "Echo",
      "Phoenix",
      "Shadow",
      "Rogue",
    ];
    const usernames: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      const randomNumber = Math.floor(Math.random() * 1000);
      usernames.push(`${randomWord}${randomNumber}`);
    }
    return usernames;
  };

  const [form, setForm] = useState({
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Arial",
    fillColor: "#74eb39",
    scrollDirection: "From Top",
    strokeWidth: 0,
    strokeColor: "#000000",
    columns: 3,
    names: generateRandomUsernames(99),
    speed: 1,
  });

  const formRef = useRef(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const frameNumber = useRef(0);
  const lastUpdateTime = useRef(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startAnimation();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };


  const restartAnimation = ( ) => {
    frameNumber.current = 0;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Your submit logic
  };

  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime.current;

      if (elapsed > 1000 / 60) {
        // Define velocity based on scroll direction
        let velocityX = 0,
          velocityY = 0;
        switch (formRef.current.scrollDirection) {
          case "From Top":
            velocityY = 1;
            break;
          case "From Bottom":
            velocityY = -1;
            break;
          case "From Left":
            velocityX = 1;
            break;
          case "From Right":
            velocityX = -1;
            break;
        }
        drawFrame(ctx, velocityX, velocityY);
        frameNumber.current++;
        lastUpdateTime.current = now;
      }

      requestAnimationFrame(render);
    };
    render();
  };

  const drawFrame = (
    ctx: CanvasRenderingContext2D,
    velocityX: number,
    velocityY: number,
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = `${formRef.current.fontWeight} ${formRef.current.fontSize}px ${formRef.current.fontFamily}`;
    ctx.fillStyle = formRef.current.fillColor;

    formRef.current.names.forEach((name, index) => {
      const columnWidth = ctx.canvas.width / formRef.current.columns;
      const rowIndex = Math.floor(index / formRef.current.columns);
      let xPosition = (index % formRef.current.columns) * columnWidth;
      let yPosition = rowIndex * formRef.current.fontSize;

      // Apply velocity
      xPosition += velocityX * frameNumber.current * formRef.current.speed;
      yPosition += velocityY * frameNumber.current * formRef.current.speed;

      // Measure text width
      const textMetrics = ctx.measureText(name);
      const textWidth = textMetrics.width;
      const textHeight = formRef.current.fontSize; // Approximation of text height

      // Draw text if any part of it is still within the canvas bounds
      const isWithinHorizontalBounds =
        xPosition + textWidth >= 0 && xPosition <= ctx.canvas.width;
      const isWithinVerticalBounds =
        yPosition + textHeight >= 0 && yPosition <= ctx.canvas.height;

      if (isWithinHorizontalBounds && isWithinVerticalBounds) {
        ctx.fillText(name, xPosition, yPosition);

        if (formRef.current.strokeWidth > 0) {
          ctx.strokeStyle = formRef.current.strokeColor;
          ctx.lineWidth = formRef.current.strokeWidth;
          ctx.strokeText(name, xPosition, yPosition);
        }
      }
    });
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-90 px-12 py-20 bg-gray-700 max-h-screen overflow-y-scroll">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="fontSize">Font Size:</label>
            <input
              type="number"
              id="fontSize"
              name="fontSize"
              value={form.fontSize}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="fontWeight">Font Weight:</label>
            <select
              id="fontWeight"
              name="fontWeight"
              value={form.fontWeight}
              onChange={handleInputChange}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="fontFamily">Font Family:</label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={form.fontFamily}
              onChange={handleInputChange}
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="fillColor">Font Color:</label>
            <input
              type="color"
              id="fillColor"
              name="fillColor"
              value={form.fillColor}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="columns">Number of Columns:</label>
            <input
              type="number"
              id="columns"
              name="columns"
              value={form.columns}
              min="1"
              max="10"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="speedControl">Speed Control:</label>
            <input
              type="range"
              id="speedControl"
              name="speed"
              value={form.speed}
              min="0.01"
              max="1"
              step="0.01"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="scrollDirection">Scroll Direction:</label>
            <select
              id="scrollDirection"
              name="scrollDirection"
              value={form.scrollDirection}
              onChange={handleInputChange}
            >
              <option value="From Top">From Top</option>
              <option value="From Left">From Left</option>
              <option value="From Right">From Right</option>
              <option value="From Bottom">From Bottom</option>
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="strokeWidth">Stroke Width:</label>
            <input
              type="number"
              id="strokeWidth"
              name="strokeWidth"
              value={form.strokeWidth}
              min="0"
              max="3"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="strokeColor">Stroke Color:</label>
            <input
              type="color"
              id="strokeColor"
              name="strokeColor"
              value={form.strokeColor}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={restartAnimation}>Restart</button>
        </form>
      </div>

      <div className="flex-grow flex justify-center items-center bg-gray-900">
        <canvas
          ref={canvasRef}
          className="border-2 border-dashed border-gray-800 rounded-xl"
          width="800"
          height="600"
        ></canvas>
      </div>
    </div>
  );
};

export default App;

