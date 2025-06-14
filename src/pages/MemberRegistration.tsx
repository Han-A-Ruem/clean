
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddressFormStep from "@/components/member/AddressFormStep";
import AddressSearch, { AddressResult } from "@/components/member/AddressSearch";

interface Address {
  main: string;
  detail: string;
  full: string;
}

const MemberRegistration = () => {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showSearchAddress, setShowSearchAddress] = useState(true);

  const handleBack = () => {
    if (selectedAddress) {
      setSelectedAddress(null);
      setShowSearchAddress(true);
    } else {
      navigate(-1);
    }
  };

  const handleAddressSelect = (address: AddressResult) => {
    setSelectedAddress({
      main: address.main,
      detail: address.detail,
      full: address.full
    });
    setShowSearchAddress(false);
  };

  if (showSearchAddress) {
    return (
      <AddressSearch
        onBack={() => navigate(-1)}
        onAddressSelect={handleAddressSelect}
      />
    );
  }

  if (selectedAddress) {
    return (
      <AddressFormStep
        onBack={handleBack}
        mainAddress={selectedAddress.main}
        detailAddress={selectedAddress.detail}
      />
    );
  }

  // Fallback - shouldn't reach here normally
  return (
    <div className="min-h-screen bg-white cleaner-theme">
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
      </div>
      <div className="p-4 text-center">
        <p>주소를 선택하여 시작하세요.</p>
      </div>
    </div>
  );
};

export default MemberRegistration;
