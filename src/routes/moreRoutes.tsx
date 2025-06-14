
import Profile from "@/components/more/profile/Profile";
import AddressList from "@/components/more/address/AddressList";
import PaymentMethodsList from "@/components/more/payment/PaymentMethodsList";
import CouponsList from "@/components/more/coupon/CouponsList";
import Referral from "@/components/more/Referral";
import NotificationsSettings from "@/components/more/NotificationsSettings";
import Notices from "@/components/more/Notices";
import FAQs from "@/components/more/FAQs";
import Events from "@/pages/Events";
import EventDetail from "@/components/events/EventDetail";
import UserNotifications from "@/pages/UserNotifications";
import UsageGuide from "@/components/menu/UsageGuide";
import InquiryForm from "@/components/menu/InquiryForm";
import TermsAndPolicies from "@/components/menu/TermsAndPolicies";
import TermsOfUse from "@/components/terms/TermsOfUse";
import PrivacyPolicy from "@/components/terms/PrivacyPolicy";
import PrivacyInfo from "@/components/terms/PrivacyInfo";
import LocationPolicy from "@/components/terms/LocationPolicy";
import BusinessInfo from "@/components/terms/BusinessInfo";
import More from "@/pages/More";
import AddressEdit from "@/components/more/address/AddressEdit";
import AddressAdd from "@/components/more/address/AddressAdd";
import AddressManagement from "@/components/address/AddressManagement";
import ChatList from "@/components/chat/ChatList";
import ChatDetail from "@/components/chat/ChatDetail";
import InviteComponent from "@/components/InviteComponent";

export const getRouteComponent = (path: string) => {
  // Check for address editing route with ID
  if (path.startsWith('address/')) {
    // Extract parts after "address/"
    const parts = path.split("/");

    console.log('part', parts);

    switch(parts[1]) {
      case 'edit': 
        return <AddressEdit addressId={parts[2]} />;
      case 'add': 
        return <AddressAdd />;
      default:
        return null;
    }
  }
  
  // Check for chat detail route
  if (path.startsWith('chat/')) {
    const chatId = path.split('/')[1];
    console.log('goes here', path);

    return <ChatDetail />;
  }
  
  // Use path to determine which component to render
  if (path.startsWith('terms-policies/')) {
    const subPath = path.split('terms-policies/')[1];
    console.log({'dsd': subPath});
    switch (subPath) {
      case 'terms-of-use':
        return <TermsOfUse />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'privacy-info':
        return <PrivacyInfo />;
      case 'location':
        return <LocationPolicy />;
      case 'business-info':
        return <BusinessInfo />;
      default:
        return <TermsAndPolicies />;
    }
  }

  // Original route matching for top-level routes
  switch (path) {
    case "invite":
      return  <InviteComponent />;
    case "profile":
      return <Profile />;
    case "address":
      return <AddressManagement />;
    case "payment":
      return <PaymentMethodsList />;
    case "coupons":
      return <CouponsList />;
    case "referral":
      return <Referral />;
    case "notifications-settings":
      return <NotificationsSettings />;
    case "notifications":
      return <UserNotifications />;
    case "notices":
      return <Notices />;
    case "faqs":
      return <FAQs />;
    case "events":
      return <Events />;
    case "events-detail":
      return <EventDetail />;
    // case "usage-guide":
    //   return <UsageGuide />;
    case "inquiry":
      return <InquiryForm />;
    case "terms-policies":
      return <TermsAndPolicies />;
    case "chat":
      return <ChatList />;
    default:
      return <More />;
  }
};
