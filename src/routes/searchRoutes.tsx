import LocationFilterSheet from "@/components/search/LocationFilterSheet";
import RecommendedWorkList from "@/components/search/RecommendedWorkList";
import RecommendedWorkDetails from "@/components/search/RecommendedWorkDetails";
import { useSearchContext, SearchProvider } from "@/contexts/SearchContext";
import Search from "@/pages/Search";
import { useNavigate, useParams } from "react-router-dom";

function SearchRouteContent({ path }: { path: string }) {
    const navigate = useNavigate();
    const { selectedFilter, selectedRegions, selectedWorkTime } = useSearchContext();
    const params = useParams();

    const [mainPath, subPath] = path.split('/').filter(Boolean);

    console.log(mainPath, subPath);

    switch (mainPath) {
        case undefined:
            return <Search />;
        case "by-region":
            return (
                <LocationFilterSheet 
                    onBack={() => navigate('/search')} 
                />
            );
        case 'recommended-work':
            if (subPath) {

                console.log('goes here',subPath);
                return <RecommendedWorkDetails />;
            }
            return <RecommendedWorkList 
                onBack={() => navigate('/search/by-region')} 
                selectedRegions={selectedRegions} 
                selectedFilter={selectedFilter}
                workTime={selectedWorkTime}
            />;
        default:
            return <Search />;
    }
}

export function getSearchComponent(path: string) {
    return (
        <SearchProvider>
            <SearchRouteContent path={path} />
        </SearchProvider>
    );
}
