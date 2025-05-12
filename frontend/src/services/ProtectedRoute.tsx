import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Progress } from "../types/types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredStep?: Progress;
};

const ProtectedRoute = ({ children, requiredStep }: ProtectedRouteProps) => {
  const { isJwtValid, progress } = useContext(AuthContext)!;
  // const progress = sessionStorage.getItem("progress");
  console.log("Last progress:", progress);

  if (!isJwtValid()) {
    return <Navigate to="/login" replace />;
  }

  // Enforce page order
  const order = [Progress.HOME, Progress.LOBBY, Progress.GAME];
  if (
    requiredStep &&
    (!progress || order.indexOf(progress) < order.indexOf(requiredStep))
  ) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};



export default ProtectedRoute;
