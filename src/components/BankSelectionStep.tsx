
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import RegistrationComplete from "./member/RegistrationComplete";
import { useRegistration } from "@/contexts/RegistrationContext";

interface BankSelectionStepProps {
  onBack: () => void;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
}

const KOREAN_BANKS: Bank[] = [
  {
    id: "kookmin",
    name: "국민은행",
    logo: "placeholder.svg"
  },
  {
    id: "nonghyup",
    name: "농협은행",
    logo: "placeholder.svg"
  },
  {
    id: "woori",
    name: "우리은행",
    logo: "placeholder.svg"
  },
  {
    id: "shinhan",
    name: "신한은행",
    logo: "placeholder.svg"
  },
  {
    id: "hana",
    name: "하나은행",
    logo: "placeholder.svg"
  },
  {
    id: "kiup",
    name: "기업은행",
    logo: "placeholder.svg"
  },
  {
    id: "semaul",
    name: "새마을금고",
    logo: "placeholder.svg"
  },
  {
    id: "kakao",
    name: "카카오뱅크",
    logo: "placeholder.svg"
  }
];

const BankSelectionStep = ({ onBack }: BankSelectionStepProps) => {
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [showAccountInput, setShowAccountInput] = useState(false);
  // const { updateBankInfo } = useRegistration();

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
    setShowAccountInput(true);
  };


  if (showAccountInput) {
    return <RegistrationComplete />;
  }

  // if (showAccountInput && selectedBank) {
  //   return (
  //     <div className="min-h-screen bg-white cleaner-theme">
  //       <div className="sticky top-0 bg-white z-10 border-b">
  //         <div className="flex items-center justify-between p-4">
  //           <button onClick={() => setShowAccountInput(false)} className="p-2">
  //             <ArrowLeft className="h-6 w-6" />
  //           </button>
  //           <h1 className="text-lg">계좌번호 입력</h1>
  //           <div className="w-6"></div>
  //         </div>
  //       </div>

  //       <div className="p-4 space-y-6">
  //         <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
  //           <img
  //             src={selectedBank.logo}
  //             alt={selectedBank.name}
  //             className="w-12 h-12 rounded-full"
  //           />
  //           <div>
  //             <h2 className="font-medium">{selectedBank.name}</h2>
  //             <p className="text-sm text-gray-500">계좌번호를 입력해주세요</p>
  //           </div>
  //         </div>

  //         <div className="space-y-2">
  //           <label className="text-sm font-medium">계좌번호</label>
  //           <input
  //             type="text"
  //             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cleaner"
  //             placeholder="숫자만 입력해주세요"
  //             value={accountNumber}
  //             onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
  //           />
  //         </div>

  //         <button
  //           onClick={handleAccountSubmit}
  //           disabled={!accountNumber}
  //           className={`w-full py-3 rounded-lg text-white ${
  //             accountNumber ? 'bg-primary-cleaner hover:bg-primary-cleaner/90' : 'bg-gray-300'
  //           }`}
  //         >
  //           완료
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white cleaner-theme">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button className="text-lg">메뉴</button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">보수를 받으실</h1>
          <h2 className="text-2xl font-bold">은행을 선택해 주세요.</h2>
        </div>

        <div className="space-y-2">
          {KOREAN_BANKS.map((bank) => (
            <button
              key={bank.id}
              className="w-full flex items-center justify-between p-4 border-b"
              onClick={() => handleBankSelect(bank)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-base">{bank.name}</span>
              </div>
              <div className="text-primary-cleaner">
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BankSelectionStep;
