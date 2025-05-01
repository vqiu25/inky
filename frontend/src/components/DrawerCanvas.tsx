import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { socket } from "../services/socket";

const DrawerCanvas: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas("canv", {
      height: 500,
      width: 500,
      backgroundColor: "white",
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "black";

    canvasRef.current = canvas;

    canvas.on("path:created", () => {
      emitCanvasData(canvas);
    });

    return () => {
      canvas.dispose(); // cleanup
    };
  }, []);

  const emitCanvasData = (canvas: fabric.Canvas) => {
    const data = canvas.toJSON();
    console.log("im the drawer and im sending something", data);
    socket.emit("canvas-data", { data });
  };

  const setPen = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "black";
    }
  };

  const setEraser = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = "white";
      canvas.freeDrawingBrush.width = 10;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.clear();
      canvas.setBackgroundColor("white", () => canvas.renderAll());
      emitCanvasData(canvas); // Emit the cleared canvas data to the server
    }
  };

  return (
    <div>
      <button type="button" name="pen" onClick={setPen}>
        Free draw with pen
      </button>
      <button type="button" name="eraser" onClick={setEraser}>
        Eraser
      </button>
      <button type="button" name="clear" onClick={clearCanvas}>
        Clear
      </button>
      <div>
        <canvas id="canv" style={{ border: "2px solid black" }}></canvas>
      </div>
    </div>
  );
};

export default DrawerCanvas;
