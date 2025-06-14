
import { getSearchComponent } from "@/routes/searchRoutes";
import React from "react";
import { useParams } from "react-router-dom";
import TabBar from "../TabBar";
import { SearchProvider } from "@/contexts/SearchContext";

const SearchRouteHandler: React.FC = () => {
    const { '*': restPath } = useParams<{ id: string; '*': string }>();
    const fullPath = (restPath ? `${restPath}` : '');
    // Get the component for the current route
    const component = getSearchComponent(fullPath);
    
    // Only show TabBar on the main search page
    const showTabBar = !fullPath || fullPath === '/';
  
    return (
      <>
        <div className={showTabBar ? "pb-16" : ""}>
            {component}
        </div>
        {showTabBar && <TabBar/>}
      </>
    );
};

export default SearchRouteHandler;
