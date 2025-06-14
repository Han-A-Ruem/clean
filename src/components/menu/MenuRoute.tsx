
import Menu from "@/pages/Menu";
import MyRank from "./MyRank";
import MyInfo from "./MyInfo";
import AccountManagement from "./AccountManagement";
import ActivityGuide from "./ActivityGuide";
import RankBenefits from "./RankBenefits";
import CustomerReviews from "./CustomerReviews";
import SettlementHistory from "./SettlementHistory";
import PaymentTracking from "./PaymentTracking";
import CustomerSupport from "./CustomerSupport";
import PolicyInfo from "./PolicyInfo";
import UsageGuide from "./UsageGuide";
import InquiryForm from "./InquiryForm";
import TermsAndPolicies from "./TermsAndPolicies";
import AddressEdit from "../more/address/AddressEdit";
import Info from "./Info";
import AddressManagement from "../address/AddressManagement";
import ChatList from "../chat/ChatList";
import ChatDetail from "../chat/ChatDetail";
import TestComponent from "./test/TestComponent";

const isDevelopment = "development";

export const getRouteComponent = (id: string) => {
  if (id.startsWith('address/')) {
    const subPath = id.split('address/')[1];
    console.log({'dsd': subPath})
    switch (subPath) {
      case 'edit': 
      return <AddressEdit />
      default:
        return null;
    }
  }
  
  if (id.startsWith('chat/')) {
    console.log('goes here' , id)
    console.log('goes here')
    const chatId = id.split('chat/')[1];
    return <ChatDetail />;
  }
  
  switch (id) {
    case "/":
      return <Menu/>;
    case "myrank":
      return <MyRank />;
    case "myinfo":
      return <MyInfo />;
    case "account":
      return <AccountManagement />;
    case "activity-guide":
      return <ActivityGuide />;
    case "benefits":
      return <RankBenefits />;
    case "reviews":
      return <CustomerReviews />;
    case "settlement":
      return <SettlementHistory />;
    case "payment-tracking":
      return <PaymentTracking />;
    case "customer-support":
      return <CustomerSupport />;
    case "policy":
      return <PolicyInfo />;
    case "usage-guide":
      return <UsageGuide />;
    case "inquiry":
      return <InquiryForm />;
    case "terms-policies":
      return <TermsAndPolicies />;
    case "info":
      return <Info />;
    case "address":
      return <AddressManagement />;
    case "chat":
      return <ChatList />;
    // Show test component only in development mode
    case "test":
      return <TestComponent />
    default:
      return null;
  }
};
