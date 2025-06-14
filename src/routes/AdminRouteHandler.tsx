import CleanerList from "@/components/admin/CleanerList"
import EventManagement from "@/components/admin/events/EventManagement"
import InquiryManagement from "@/components/admin/inquiries/InquiryManagement"
import InsightManagement from "@/components/admin/insights/InsightManagement"
import InterviewManagement from "@/components/admin/interviews/InterviewManagement"
import NoticeManagement from "@/components/admin/notices/NoticeManagement"
import PartnerApprovals from "@/components/admin/PartnerApprovals"
import PromotionManagement from "@/components/admin/PromotionManagement"
import RankManagement from "@/components/admin/RankManagement"
import ReservationList from "@/components/admin/ReservationList"
import ShopManagement from "@/components/admin/shop/ShopManagement"
import UserList from "@/components/admin/UserList"
import Admin from "@/pages/Admin"
import { Routes, Route, Navigate } from "react-router-dom"

export const AdminRouteHandler = () => {
  return (
    <Routes>
      <Route element={<Admin />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<UserList />} />
        <Route path="cleaners" element={<CleanerList />} />
        <Route path="partners" element={<PartnerApprovals />} />
        <Route path="reservations" element={<ReservationList />} />
        <Route path="insights" element={<InsightManagement />} />
        <Route path="ranks" element={<RankManagement />} />
        <Route path="promotions" element={<PromotionManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="shop" element={<ShopManagement />} />
        <Route path="schedule" element={<InterviewManagement />} />
        <Route path="notices" element={<NoticeManagement />} />
        <Route path="inquiries" element={<InquiryManagement />} />
      </Route>
    </Routes>
  )
}