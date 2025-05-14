import styles from "../../assets/css-modules/GameToolBar.module.css";
import { canvasRef } from "./Canvas";
import brushIcon from "../../assets/images/brush.svg";
import eraserIcon from "../../assets/images/eraser.svg";
import trashIcon from "../../assets/images/trash.svg";
import { useContext, useEffect, useState } from "react";
import { GameStateContext } from "../../context/GameStateContext";

export default function GameToolBar() {
  const { clearCanvas } = useContext(GameStateContext)!;
  const colours: string[] = [
    "black",
    "#FF8686",
    "#ff9e64",
    "#FFD65B",
    "#A7EA92",
    "#A7B1FC",
    "#bb9af7",
    "#D29F80",
  ];

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedColour, setSelectedColour] = useState<string | null>(null);

  useEffect(() => {
    handleColourClick(colours[0]); // Set default colour to the first one in the array
    setSelectedTool("pen"); // Set default tool to pen
  }, []);

  const handleToolClick = (tool: string, action: () => void) => {
    setSelectedTool(tool);
    action();
  };

  const handleColourClick = (colour: string) => {
    setSelectedColour(colour);
    if (selectedTool === "eraser") {
      return;
    }
    setColour(colour);
  };

  const setPen = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 5;
      canvas.freeDrawingBrush.color = "black";
      canvas.freeDrawingCursor = "url('/cursors/brush.svg') 0 32, auto";
      canvas.renderAll();
      setColour(selectedColour || colours[0]);
    }
  };

  const setEraser = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = "white";
      canvas.freeDrawingBrush.width = 10;
      canvas.freeDrawingCursor = "url('/cursors/eraser.svg') 4 28, auto";
      canvas.renderAll();
    }
  };

  const setColour = (colour: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.freeDrawingBrush.color = colour;
    }
  };

  return (
    <div className={styles.drawingTools}>
      <div className={styles.canvasDrawingTools}>
        <button
          className={`${styles.canvasTool} ${selectedTool === "pen" ? styles.selected : ""}`}
          onClick={() => handleToolClick("pen", setPen)}
        >
          <img src={brushIcon} />
        </button>
        <button
          className={`${styles.canvasTool} ${selectedTool === "eraser" ? styles.selected : ""}`}
          onClick={() => handleToolClick("eraser", setEraser)}
        >
          <img src={eraserIcon} />
        </button>
        <button
          className={`${styles.canvasTool} ${styles.canvasToolErase}`}
          onClick={() => clearCanvas()}
        >
          <img src={trashIcon} />
        </button>
      </div>

      <div className={styles.colourDrawingTools}>
        {colours.map((colour, idx) => (
          <button
            key={idx}
            className={`${styles.canvasTool} ${selectedColour === colour ? styles.selected : ""}`}
            onClick={() => handleColourClick(colour)}
          >
            <span style={{ backgroundColor: colour }} />
          </button>
        ))}
        <div />
      </div>
    </div>
  );
}
