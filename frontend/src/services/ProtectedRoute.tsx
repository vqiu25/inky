import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Progress } from "../types/types";
import LoadingSpinner from "../components/layoutComponents/LoadingSpinner";
import spinnerStyles from "../assets/css-modules/LoadingSpinner.module.css";
import { useJwtValidation } from "../hooks/useJwtValidation";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredStep?: Progress;
};

const ProtectedRoute = ({ children, requiredStep }: ProtectedRouteProps) => {
  const { progress } = useContext(AuthContext)!;
  const { validJwt, isLoading } = useJwtValidation();

  if (isLoading) {
    return (
      <div className={spinnerStyles.spinnerContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!validJwt) {
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
