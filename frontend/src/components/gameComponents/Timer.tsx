import { useEffect, useState } from "react";
import { socket } from "../../services/socket";

export default function Timer() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    console.log("Registering timer listener");

    // Listen for the "timer" event from the server
    socket.on("timer", (duration: number) => {
      setTimeRemaining(duration); // Update the timer state
    });

    return () => {
      socket.off("timer");
    };
  }, []);

  return (
    <div>{timeRemaining !== null ? <p>{timeRemaining}s</p> : <p>90s</p>}</div>
  );
}
