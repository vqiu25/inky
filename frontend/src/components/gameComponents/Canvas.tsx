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
    let suppressEmit = false; // <--- Flag

    if (isDrawer) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "black";
    }

    canvasRef.current = canvas;

    canvas.on("path:created", () => {
      if (!suppressEmit) {
        emitCanvasData(canvas);
      }
    });

    canvas.on("canvas:cleared", () => {
      console.log("I've cleared the canvas!");
      if (!suppressEmit) {
        emitCanvasData(canvas);
      }
    });

    socket.on("canvas-data", (payload: { data: fabric.ICanvasOptions }) => {
      suppressEmit = true;
      canvas.loadFromJSON(payload.data, () => {
        // Ensure background color is white if not already set
        if (!canvas.backgroundColor) {
          canvas.setBackgroundColor("white", canvas.renderAll.bind(canvas));
        } else {
          canvas.renderAll();
        }
        suppressEmit = false;
      });
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
