import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import { supabase } from '@/integrations/supabase/client';
import { set } from 'date-fns';
import { PromotionConfig } from '@/components/promotions';

interface ProtectedRouteContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const ProtectedRouteContext = createContext<ProtectedRouteContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
  '/sign-in',
  '/cleaner-sign-in',
  '/more/terms-policies/business-info',
  '/recruitment',
  '/reset-password',
  '/sign-in/change-password',
  '/email-confirmation-success'
];

const BYPASS_PREFERENCE_ROUTES = [
  '/signup-completion',
  '/registration-complete',
  '/reset-password',
  '/email-confirmation-success'
];

export function ProtectedRouteProvider({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingPreferences, setCheckingPreferences] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Modified to check only the pathname without query parameters
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`) || route.endsWith('*') && location.pathname.startsWith(route.slice(0, -1))
  );
  
  const isBypassPreferenceRoute = BYPASS_PREFERENCE_ROUTES.some(route => 
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  const redirect = (path: string) => {
    setRedirecting(true);
    if (location.pathname !== path) {
      navigate(path);
      setRedirecting(false);
    }
  };

  const checkCustomerPreferences = async () => {
    if (!user || !userData || userData.type !== 'customer' || checkingPreferences || isBypassPreferenceRoute) {
      return;
    }

    setCheckingPreferences(true);

    try {
      const { data, error } = await supabase
        .from('user_preferred_managers')
        .select('preferred_sex, preferred_experience, preferred_tags, cleaning_supplies')
        .eq('user_id', user.id)
        .single();

      const isIncomplete =
        error || !data || !data.preferred_sex || !data.preferred_experience || !data.preferred_tags || !data.cleaning_supplies;

      if (isIncomplete) {
        redirect('/signup-completion');
      }
    } catch (err) {
      console.error('Error checking preferences:', err);
    } finally {
      setCheckingPreferences(false);
    }
  };

  const handleRouteProtection = () => {
    if (loading) return;

    if (!user && !isPublicRoute) {
      redirect('/sign-in');
      return;
    }

    if (user && isPublicRoute && !['/reset-password', '/email-confirmation-success' , '/sign-in/change-password'].includes(location.pathname)) {
      redirect('/');
      return;
    }

    if (user && userData?.type === 'cleaner') {

      if (userData.status === 'registered') {
        const interviewSteps = [
          '/onboarding/schedule',
          '/onboarding/location',
          '/onboarding/details',
          '/onboarding/confirmation',
          '/onboarding',
        ];

        const isOnInterviewStep = interviewSteps.some(step => location.pathname.startsWith(step));

        if (!isOnInterviewStep) {
          redirect('/onboarding');
        }
        return;
      }
  
      
  
      if (userData.status === 'submitted') {
        if (location.pathname !== '/pending-approval') {
          redirect('/pending-approval');
        }
        return;
      }

      if (userData.is_active && location.pathname.includes('/pending-approval')) {
        redirect('/');
        return;
      }

    }
  };

  useEffect(() => {
    if (user && userData && !loading) {
      checkCustomerPreferences();
    }
  }, [user, userData, loading, location.pathname]);

  useEffect(() => {
    handleRouteProtection();
  }, [user, userData, loading, location.pathname]);
  

  if (loading || redirecting) {
    return (
      <PromotionConfig> 
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      </PromotionConfig>

    );
  }

  return (
    <ProtectedRouteContext.Provider value={{ isAuthenticated: !!user , isLoading: loading }}>
      {children}
    </ProtectedRouteContext.Provider>
  );
}

export function useProtectedRoute() {
  const context = useContext(ProtectedRouteContext);
  if (context === undefined) {
    throw new Error('useProtectedRoute must be used within a ProtectedRouteProvider');
  }
  return context;
}
