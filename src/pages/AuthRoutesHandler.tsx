
import { useParams, Navigate, useLocation } from "react-router-dom";
import { getAuthComponents } from "@/routes/authRoute";

const AuthRouteHandler: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const u = searchParams.get('u');
  
  if (!type) {
    return <Navigate to="/sign-in" replace />;
  }
  
  const component = getAuthComponents(type, u);
  
  if (!component) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{component}</>;
};

export default AuthRouteHandler;
