import React, { useEffect, RefObject, createRef } from "react";
import { fabric } from "fabric";
import { socket } from "../../services/socket";
import styles from "../../assets/css-modules/Canvas.module.css";

export const canvasRef: RefObject<fabric.Canvas | null> = createRef();

const Canvas: React.FC = () => {
  useEffect(() => {
    const canvas = new fabric.Canvas("canv", {
      height: 430,
      width: 600,
      backgroundColor: "white",
    });

    const isDrawer = true; // TODO Placeholder for future socket logic

    if (isDrawer) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "black";
    }

    canvasRef.current = canvas;

    canvas.on("path:created", () => {
      emitCanvasData(canvas);
    });

    canvas.on("canvas:cleared", () => {
      console.log("I've cleared the canvas!");
      emitCanvasData(canvas);
    });

    socket.on("canvas-data", (payload: { data: fabric.ICanvasOptions }) => {
      console.log("I'm the guesser and I got something", payload.data);
      const { data } = payload;
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });

    return () => {
      canvas.dispose(); // Cleanup
      socket.off("canvas-data");
    };
  }, []);

  const emitCanvasData = (canvas: fabric.Canvas) => {
    const data = canvas.toJSON();
    console.log("I'm the drawer and I'm sending something", data);
    socket.emit("canvas-data", { data });
  };

  return (
    <div>
      <canvas id="canv" className={styles.canvasElement}></canvas>
    </div>
  );
};

export default Canvas;
