import InterviewComplete from "@/components/onboarding/interviewComplete";
import InterviewDetails from "@/components/onboarding/interviewDetails";
import InterviewSite from "@/components/onboarding/interviewSite";
import NameStep from "@/components/onboarding/NameStep";
import OnboardingComplete from "@/components/onboarding/onboardingComplete";
import PetStep from "@/components/onboarding/PetStep";
import Phone from "@/components/onboarding/PhoneStep";
import WorkingAreaStep from "@/components/onboarding/WorkingAreaStep";
import ConfirmAddDetails from "@/components/onboarding/confirmAddDetails";
import HowDidYouHear from "@/components/recruitment/HowDidYouHear";
import Education from "@/pages/Education";
import InterviewSchedule from "@/pages/InterviewSchedule";
import { Route, Routes, useNavigate } from "react-router-dom";
import AddressSelection from "@/components/AddressSelection";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";

export const CleanerOnboardingRouteHandler = () => {
  console.log("CleanerOnboardingRouteHandler");

  const { data, setData } = useCleanerRegistration();
  const navigate = useNavigate();
  return (
    <Routes>
      <Route index element={<Phone />} />
      <Route path="phone" element={<Phone />} />
      <Route path="name" element={<NameStep />} />
      <Route path="how-did-you-hear-about-us" element={<HowDidYouHear />} />
      <Route path="working-area" element={<WorkingAreaStep />} />
      <Route path="pet" element={<PetStep />} />
      <Route path="confirm-details" element={<ConfirmAddDetails />} />
      <Route path="onboarding-complete" element={<OnboardingComplete />} />
      <Route path="schedule" element={<InterviewSchedule />} />
      <Route path="location" element={<InterviewSite />} />
      <Route path="details" element={<InterviewDetails />} />
      <Route path="complete" element={<InterviewComplete />} />
      <Route path="address" element={<AddressSelection type="cleaner" onNext={(address) => {
        console.log('address', address);
        setData({
          ...data,
          address: address
        })
        navigate('/onboarding/confirm-details');
      }} />} />
    </Routes>
  );
};