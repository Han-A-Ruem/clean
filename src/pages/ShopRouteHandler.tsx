
import { useParams, Navigate } from "react-router-dom";
import TabBar from "../components/TabBar";
import { getRouteComponent } from "../components/shop/ShopRoutes";

const ShopRouteHandler: React.FC = () => {
  const { id, '*': restPath } = useParams<{ id: string; '*': string }>();
  const fullPath = id + (restPath ? `/${restPath}` : '');
  

  console.log('shop', fullPath)
  // Get the component for the current route
  const component = getRouteComponent(fullPath);
  
  if (!component) {
    return <Navigate to="/shop" replace />;
  }
  
  return (
    <>
      <div className="pb-16">
        {component}
      </div>
      {id === undefined && <TabBar />}
    </>
  );
};

export default ShopRouteHandler;
