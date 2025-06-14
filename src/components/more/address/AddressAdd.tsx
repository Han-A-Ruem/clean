
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from '@/components/Utils';
import AddressSearch, { ServiceArea } from "@/components/address/AddressSearch";
import AddressAddForm from "./AddressAddForm";

const AddressAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSearch, setShowSearch] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<ServiceArea | null>(null);

  const handleAddressSelect = (address: ServiceArea) => {
    setSelectedAddress(address);
    setShowSearch(false);
  };

  const handleBack = () => {
    if (!showSearch && selectedAddress) {
      setShowSearch(true);
    } else {
      navigate('/more/address');
    }
  };

  const handleAddressAdded = () => {
    toast({
      title: "성공",
      description: "주소가 추가되었습니다.",
    });
    navigate('/more/address');
  };

  return (
    <div className="min-h-screen bg-white">
      {showSearch ? (
        <AddressSearch
          onBack={handleBack}
          onAddressSelect={handleAddressSelect}
        />
      ) : selectedAddress ? (
        <AddressAddForm
          selectedAddress={selectedAddress}
          onBack={handleBack}
          onAddressAdded={handleAddressAdded}
        />
      ) : null}
    </div>
  );
};

export default AddressAdd;
