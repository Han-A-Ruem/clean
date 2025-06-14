import { createContext, useContext, useState, useEffect } from "react"
import { ReactNode } from 'react';

interface SearchContextType {
    selectedFilter: string;
    setSelectedFilter: (data: string) => void;
    selectedRegions: string[];
    setSelectedRegions: (regions: string[]) => void;
    selectedWorkTime: string;
    setSelectedWorkTime: (time: string) => void;
    resetFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [selectedFilter, setSelectedFilter] = useState("closest");
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedWorkTime, setSelectedWorkTime] = useState("all");

    const resetFilters = () => {
        setSelectedFilter("closest");
        setSelectedRegions([]);
        setSelectedWorkTime("all");
    };

    return (
        <SearchContext.Provider value={{
            selectedFilter, 
            setSelectedFilter,
            selectedRegions,
            setSelectedRegions,
            selectedWorkTime,
            setSelectedWorkTime,
            resetFilters
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
}