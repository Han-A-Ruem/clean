
import { useParams, Navigate, useLocation } from "react-router-dom";
import { getRouteComponent } from "@/routes/moreRoutes";

const MoreRouteHandler: React.FC = () => {
  const { id, '*': restPath } = useParams<{ id: string; '*': string }>();
  const location = useLocation();
  const fullPath = id + (restPath ? `/${restPath}` : '');

  console.log({ fullPath, restPath });

  if (!id) {
    return <Navigate to="/more" replace />;
  }

  // Get the component for the current route
  const component = getRouteComponent(fullPath);

  if (!component) {
    return <Navigate to="/more" replace />;
  }

  // Return the component directly without conditional rendering that might cause issues
  return <>{component}</>;
};

export default MoreRouteHandler;
