
import { useParams, Navigate } from "react-router-dom";
import TabBar from "../TabBar";
import { getRouteComponent } from "./MenuRoute";

const MenuRouteHandler: React.FC = () => {
  const { id, '*': restPath } = useParams<{ id: string; '*': string }>();
  const fullPath = id + (restPath ? `/${restPath}` : '');
  console.log({mgsl: 'id', fullPath})
  

  // Get the component for the current route
  const component = getRouteComponent(fullPath);
  
  if (!component) {
    return <Navigate to="/menu" replace />;
  }
  
  return (
    <>
      <div className="">
        {component}
      </div>

      {id  == undefined  && <TabBar />}
    </>
  );
};

export default MenuRouteHandler;
