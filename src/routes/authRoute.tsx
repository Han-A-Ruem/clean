
import Auth from "@/pages/Auth"
import Cleaner from "@/pages/Cleaner";
import EmailConfirmation from "@/components/auth/EmailConfirmation";
import EmailConfirmationSuccess from "@/components/auth/EmailConfirmationSuccess";
import ApprovalMessage from "@/components/auth/ApprovalMessage";
import Resume from "@/components/auth/Resume";
import InterviewSite from "@/components/onboarding/interviewSite";
import { Route, Routes } from "react-router-dom";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { ChangePassword } from "@/components/auth/ChangePassword";

export const getAuthComponents = (id: string, u: string) => {
    switch(id) {
        case 'sign-in': 
            return <Routes>
                <Route path="" element={u === "cleaner" ? <Cleaner /> : <Auth />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="change-password" element={<ChangePassword />} />
            </Routes>;
        case 'email-confirmation':
            return <EmailConfirmation/>
        case 'email-confirmation-success':
            return <EmailConfirmationSuccess/>
        case 'pending-approval':
            return <ApprovalMessage/>
        case 'resume':
            return <Resume/>
        case 'interview-site':
            return <InterviewSite/>
        default: 
            return;
    }
}
