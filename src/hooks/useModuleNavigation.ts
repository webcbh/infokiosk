import React, { useCallback } from 'react';

export function useModuleNavigation({ 
    activeModule, 
    activeSubmodule, 
    setActiveModule, 
    setActiveSubmodule 
}: { 
    activeModule: any, 
    activeSubmodule: any, 
    setActiveModule: (m: any) => void, 
    setActiveSubmodule: (s: any) => void 
}) {

    const goBack = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (activeSubmodule) {
            setActiveSubmodule(null);
        } else {
            setActiveModule(null);
        }
    }, [activeModule, activeSubmodule, setActiveModule, setActiveSubmodule]);

    const goHome = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setActiveSubmodule(null);
        setActiveModule(null);
    }, [setActiveModule, setActiveSubmodule]);

    const openSubmodule = useCallback((sub: any, options?: { parentTitle?: string, layout?: string }) => {
        let defaultLayout = options?.layout || sub.layout;
        if (!defaultLayout) {
             if (sub.title === 'BUS ROUTES' || sub.title === 'Bus Routes') {
                 defaultLayout = 'busRoutes';
             } else if (sub.title === 'AIRPORT INFORMATION' || sub.title === 'Airport Information' || (sub.title || '').toLowerCase().includes('airport')) {
                 defaultLayout = 'airportInfo';
             } else if (['restaurants'].includes(activeModule?.templateId) || activeModule?.id === 'm3' || (activeModule?.title || '').toLowerCase().includes('restaurant')) {
                 defaultLayout = 'restaurant';
             } else if (['suites'].includes(activeModule?.templateId) || activeModule?.id === 'm2' || (activeModule?.title || '').toLowerCase().includes('suite') || (activeModule?.title || '').toLowerCase().includes('room')) {
                 defaultLayout = 'suite';
             } else {
                 defaultLayout = activeModule?.templateId || 'grid';
             }
        }
        
        setActiveSubmodule({
            ...sub,
            parentModuleTitle: options?.parentTitle || activeModule?.title || 'Module',
            layout: defaultLayout
        });
    }, [activeModule, setActiveSubmodule]);

    return {
        goBack,
        goHome,
        openSubmodule
    };
}
