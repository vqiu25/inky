import React, {
  useEffect,
  RefObject,
  createRef,
  useContext,
  useRef,
} from "react";
import { fabric } from "fabric";
import { socket } from "../../services/socket";
import styles from "../../assets/css-modules/Canvas.module.css";
import { GameStateContext } from "../../context/GameStateContext";
import { UsersContext } from "../../context/UsersContext";

export const canvasRef: RefObject<fabric.Canvas | null> = createRef();

const Canvas: React.FC = () => {
  const { currentDrawer } = useContext(GameStateContext)!;
  const { currentUser } = useContext(UsersContext)!;
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!parentRef.current) {
      console.error("Parent ref is null");
      return;
    }

    const parent = parentRef.current;
    const { width: parentWidth, height: parentHeight } =
      parent.getBoundingClientRect();

    const canvas = new fabric.Canvas("canv", {
      height: parentHeight, // Set initial height based on parent
      width: parentWidth, // Set initial width based on parent
      backgroundColor: "white",
      selection: false,
    });

    canvas.freeDrawingCursor = "url('/cursors/brush.svg') 0 32, auto";

    const isDrawer = currentDrawer?._id === currentUser?._id;
    let suppressEmit = false; // <--- Flag

    if (isDrawer) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "black";
    }

    canvasRef.current = canvas;

    const resizeCanvas = () => {
      const { width: newWidth, height: newHeight } =
        parent.getBoundingClientRect();

      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);

      // Optionally scale content proportionally
      canvas.getObjects().forEach((obj) => {
        obj.scaleX = (obj.scaleX || 1) * (newWidth / canvas.width!);
        obj.scaleY = (obj.scaleY || 1) * (newHeight / canvas.height!);
        obj.left = (obj.left || 0) * (newWidth / canvas.width!);
        obj.top = (obj.top || 0) * (newHeight / canvas.height!);
        obj.setCoords();
      });

      canvas.renderAll();
    };

    window.addEventListener("resize", resizeCanvas);

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
      canvas.dispose(); // Cleanup
      socket.off("canvas-data");
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [parentRef.current, currentDrawer]);

  const emitCanvasData = (canvas: fabric.Canvas) => {
    const data = canvas.toJSON();
    console.log("I'm the drawer and I'm sending something", data);
    socket.emit("canvas-data", { data });
  };

  return (
    <div ref={parentRef} className={styles.canvasParent}>
      <canvas id="canv" className={styles.canvasElement}></canvas>
    </div>
  );
};

export default Canvas;
