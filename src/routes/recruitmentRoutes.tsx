
import Education from "@/pages/Education";
import HowDidYouHear from "@/pages/HowDidYouHear";
import EducationSchedule from "@/pages/EducationSchedule";
import InterviewSchedule from "@/pages/InterviewSchedule";

type RouteConfig = {
  [key: string]: React.ReactNode;
};

// Define the components for each route
const routeComponents: RouteConfig = {
  "signup": <Education />,
  "how-did-you-hear": <HowDidYouHear />,
  "schedule": <EducationSchedule />,
  "interview": <InterviewSchedule />
};

// Function to get the component for a specific route
export const getRecruitmentRouteComponent = (id: string): React.ReactNode => {
  return routeComponents[id] || null;
}
