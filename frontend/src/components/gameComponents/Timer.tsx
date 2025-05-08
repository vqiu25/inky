import { useEffect, useState } from "react";
import { socket } from "../../services/socket";

export default function Timer() {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    console.log("Registering timer listener");

    // Listen for the "timer" event from the server
    socket.on("timer", (duration: number) => {
      console.log("Timer received with duration:", duration);
      setTimeRemaining(duration); // Update the timer state
    });

    return () => {
      socket.off("timer");
    };
  }, []);

  return (
    <div>
      {timeRemaining !== null ? <h2>{timeRemaining}s</h2> : <h2>90s</h2>}
    </div>
  );
}
