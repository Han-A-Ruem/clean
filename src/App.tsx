import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TabBar from "./components/TabBar";
import Schedule from "./pages/Schedule";
import Notifications from "./pages/Notifications";
import Menu from "./pages/Menu";
import Recruitment from "./pages/Recruitment";
import MemberRegistration from "./pages/MemberRegistration";
import ReservationDetail from "./components/home/ReservationDetail";
import ReviewForm from "./components/home/reservation-detail/ReviewForm";
import RequestedServicesPage from "./components/home/reservation-detail/RequestedServicesPage";
import JobDetail from "./components/search/JobDetail";
import { RegistrationProvider } from "./contexts/RegistrationContext";
import Admin from "./pages/Admin";
import Shop from "./pages/Shop";
import Events from "./pages/Events";
import More from "./pages/More";
import MoreRouteHandler from "./pages/MoreRouteHandler";
import RecruitmentRouteHandler from "./pages/RecruitmentRouteHandler";
import ReservationRouteHandler from "./pages/ReservationRouteHandler";
import ShopRouteHandler from "./pages/ShopRouteHandler";
import { ReservationProvider } from "./contexts/ReservationContext";
import MenuRouteHandler from "./components/menu/MenuRouteHandler";
import InterviewSchedule from './pages/InterviewSchedule';
import SignupCompletion from "./components/auth/SignupCompletion";
import RegistrationComplete from "./components/auth/RegistrationComplete";
import ProtectedRoute from "./routes/ProtectedRoute";
import BookingsV2 from "./pages/BookingsV2";
import BookingV2Detail from "./components/bookings/BookingV2Detail";
import NotificationBanner from "./components/notifications/NotificationBanner";
import { PromotionSheet } from "./components/home";
import { NotificationProvider } from "./contexts/NotificationContext";
import PromotionProvider, { usePromotion } from "./contexts/PromotionContext";
import SearchRouteHandler from "./components/search/searchRouteHandler";
import { PromotionConfig } from "./components/promotions";
import AuthRouteHandler from "./pages/AuthRoutesHandler";
import { ProtectedRouteProvider } from "@/contexts/ProtectedRouteContext";
import { StrictMode } from "react";
import { CleanerOnboardingRouteHandler } from "./routes/CleanerOnboardingRouteHandler";
import { CleanerRegistrationProvider } from "./contexts/CleanerRegistrationContext";
import { AdminRouteHandler } from "./routes/AdminRouteHandler";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showPromotion, setShowPromotion } = usePromotion();
  
  const handleClosePromotion = () => {
    setShowPromotion(false);
  };

  return (
    <>
      <TooltipProvider>
          <Toaster />
          <Sonner
            className="sonner-toast-container"
            toastOptions={{
              className: "sonner-toast",
              duration: 5000,
            }}
          />
          <BrowserRouter>
            <ProtectedRouteProvider>
              <NotificationBanner />
              <PromotionSheet
                isOpen={showPromotion}
                onClose={handleClosePromotion}
              />
              
              <Routes>
                <Route path="/onboarding/*" element={
                  <PromotionConfig>
                  <CleanerRegistrationProvider>
                  <CleanerOnboardingRouteHandler />
                  </CleanerRegistrationProvider>
                  </PromotionConfig>} />
                <Route path="/:type/*" element={<PromotionConfig><AuthRouteHandler/></PromotionConfig>} />
                <Route
                  path="/signup-completion"
                  element={
                    <PromotionConfig><SignupCompletion /></PromotionConfig>
                  }
                />
                <Route
                  path="/registration-complete"
                  element={
                    <PromotionConfig><RegistrationComplete /></PromotionConfig>
                  }
                />
                <Route
                  path="/"
                  element={
                    <>
                      <div className="pb-16 my-0 mb-16">
                        <Index />
                      </div>
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/reservation/detail/:id"
                  element={
                    <>
                      <ReservationDetail />
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/reservation/detail/:id/review"
                  element={
                    <ReviewForm />
                  }
                />
                <Route
                  path="/reservation/requested-service/:id"
                  element={
                    <RequestedServicesPage />
                  }
                />
                <Route
                  path="/reservation/:id?"
                  element={
                    <ReservationRouteHandler />
                  }
                />
                <Route
                  path="/menu/:id?/*"
                  element={
                    <MenuRouteHandler />
                  }
                />
                <Route
                  path="/menu/"
                  element={
                    <>
                      <Menu />
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/search/*"
                  element={
                    <SearchRouteHandler/>
                  }
                />
                <Route
                  path="/schedule/:id?"
                  element={
                    <>
                      <Schedule />
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <>
                      <Notifications />
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <>
                      <div className="pb-16">
                        <BookingsV2 />
                      </div>
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/bookings/:id"
                  element={
                    <>
                      <div className="pb-16">
                        <BookingV2Detail />
                      </div>
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/more/*"
                  element={
                    <>
                      <div className="pb-16">
                        <More />
                      </div>
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <>
                      <Shop/>
                      <TabBar/>
                    </>
                  }
                />
                <Route
                  path="/shop/:id/*"
                  element={
                    <ShopRouteHandler />
                  }
                />
                <Route
                  path="/job/:id"
                  element={
                    <JobDetail />
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <PromotionConfig><AdminRouteHandler /></PromotionConfig>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <>
                      <div className="pb-16">
                        <Events />
                      </div>
                      <TabBar />
                    </>
                  }
                />
                <Route
                  path="/more/:id?/*"
                  element={
                    <MoreRouteHandler />
                  }
                />
                <Route
                  path="/interview-schedule"
                  element={<PromotionConfig><InterviewSchedule /></PromotionConfig>}
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/recruitment" element={<PromotionConfig><Recruitment /></PromotionConfig>} />
                <Route path="/recruitment/:id/*" element={<PromotionConfig><RecruitmentRouteHandler /></PromotionConfig>} />
                <Route path="/Member" element={<PromotionConfig><MemberRegistration /></PromotionConfig>} />
              </Routes>
            </ProtectedRouteProvider>
          </BrowserRouter>
      </TooltipProvider>
    </>
  );
}

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RegistrationProvider>
            <ReservationProvider>
              <NotificationProvider>
                <PromotionProvider>
                  <AppContent />
                </PromotionProvider>
              </NotificationProvider>
            </ReservationProvider>
          </RegistrationProvider>
        </UserProvider>
      </QueryClientProvider>
      </StrictMode>
  );
};

export default App;
