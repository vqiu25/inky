import React, { useEffect, useContext, useRef, useState } from "react";
import { fabric } from "fabric";
import { socket } from "../../services/socket";
import styles from "../../assets/css-modules/Canvas.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import useCurrentUser from "../../hooks/useCurrentUser";
import { canvasReference } from "./CanvasReference";

const Canvas: React.FC = () => {
  const canvasRef = canvasReference;
  const { currentDrawer } = useContext(GameStateContext)!;
  const currentUser = useCurrentUser();
  const parentRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!parentRef.current) {
      console.error("Parent ref is null");
      return;
    }

    const parent = parentRef.current;
    const { width: parentWidth, height: parentHeight } =
      parent.getBoundingClientRect();

    const newCanvas = new fabric.Canvas("canv", {
      height: parentHeight,
      width: parentWidth,
      backgroundColor: "white",
      selection: false,
    });
    newCanvas.freeDrawingCursor = "url('/cursors/brush.svg') 0 32, auto";

    canvasRef.current = newCanvas;
    setCanvas(newCanvas);

    const resizeCanvas = () => {
      if (!parent) return;

      const { width: newWidth, height: newHeight } =
        parent.getBoundingClientRect();

      if (newWidth > 0 && newHeight > 0) {
        const oldWidth = newCanvas.getWidth
          ? newCanvas.getWidth()
          : newCanvas.width;
        const oldHeight = newCanvas.getHeight
          ? newCanvas.getHeight()
          : newCanvas.height;

        newCanvas.setDimensions(
          { width: newWidth, height: newHeight },
          { cssOnly: false },
        );

        if (oldWidth && oldHeight && newCanvas.getObjects().length > 0) {
          newCanvas.getObjects().forEach((obj) => {
            obj.scaleX = (obj.scaleX || 1) * (newWidth / oldWidth);
            obj.scaleY = (obj.scaleY || 1) * (newHeight / oldHeight);
            obj.left = (obj.left || 0) * (newWidth / oldWidth);
            obj.top = (obj.top || 0) * (newHeight / oldHeight);
            obj.setCoords();
          });
        }

        newCanvas.renderAll();
      }
    };
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(parent);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      newCanvas.dispose();
      canvasRef.current = null;
    };
  }, [parentRef, currentDrawer]);

  // Second useEffect to handle drawing permissions and socket events
  useEffect(() => {
    if (!canvas || !currentUser) return;

    let suppressEmit = false;
    const isDrawer = currentDrawer?._id === currentUser?._id;

    if (isDrawer) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "black";
    } else {
      canvas.isDrawingMode = false;
    }

    canvas.on("path:created", () => {
      if (!suppressEmit) {
        emitCanvasData(canvas);
      }
    });

    canvas.on("canvas:cleared", () => {
      if (!suppressEmit) {
        emitCanvasData(canvas);
      }
    });

    socket.on("canvas-data", (payload: { data: fabric.ICanvasOptions }) => {
      suppressEmit = true;
      canvas.loadFromJSON(payload.data, () => {
        // Disable selection for all objects
        canvas.getObjects().forEach((obj) => {
          obj.selectable = false;
          obj.hoverCursor = "default";
        });
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
      socket.off("canvas-data");
      canvas.off("path:created");
      canvas.off("canvas:cleared");
    };
  }, [canvas, currentUser, currentDrawer]);

  const emitCanvasData = (canvas: fabric.Canvas) => {
    const data = canvas.toJSON();
    socket.emit("canvas-data", { data });
  };

  return (
    <div ref={parentRef} className={styles.canvasParent}>
      <canvas id="canv" className={styles.canvasElement}></canvas>
    </div>
  );
};

export default Canvas;
