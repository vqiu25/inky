import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import io from "socket.io-client";

const GuesserCanvas: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  const socket = io("http://localhost:3000");
  useEffect(() => {
    const canvas = new fabric.Canvas("canv", {
      height: 500,
      width: 500,
      backgroundColor: "white",
    });

    canvasRef.current = canvas;

    socket.on("canvas-data", (payload: { data: fabric.ICanvasOptions }) => {
      console.log("im the guess and i got something", payload.data);
      const { data } = payload;
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

    return () => {
      canvas.dispose(); // cleanup
      socket.off("canvas-data"); // Remove the event listener
    };
  }, []);

  return (
    <div>
      <div>
        <canvas id="canv" style={{ border: "2px solid black" }}></canvas>
      </div>
    </div>
  );
};

export default GuesserCanvas;
