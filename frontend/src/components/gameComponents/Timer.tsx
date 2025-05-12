import { useContext, useEffect } from "react";
import { socket } from "../../services/socket";
import { GameStateContext } from "../../context/GameStateContext";

export default function Timer() {
  // const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { timeRemaining, updateTime } = useContext(GameStateContext)!;
  useEffect(() => {
    console.log("Registering timer listener");

    // Listen for the "timer" event from the server
    socket.on("timer", (duration: number) => {
      updateTime(duration);
    });

    return () => {
      socket.off("timer");
    };
  }, []);

  return (
    <div>{timeRemaining !== null ? <p>{timeRemaining}s</p> : <p>90s</p>}</div>
  );
}
