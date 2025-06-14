import React from 'react';
import { PageHeader } from '../Utils';

const CustomerTerms = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50/80">
      <PageHeader title="이용약관" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      <div className="p-5">
        <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl border border-white/40 shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-5">가사관리사 파견 중개 인터넷 플랫폼 이용약관</h2>
          <div className="space-y-6 text-gray-700">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 1조 (목적)</h3>
              <p className="leading-relaxed">
                본 약관은 플랫폼 이용자의 개인정보 보호와 관련 법령을 준수하기 위한 규정을 명확히 하며, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 통신비밀보호법, 전기통신사업법, 전자상거래법 등을 포함한 관련 법령을 준수하여 개인정보를 수집, 이용, 제공, 보관, 처리하는 절차를 정의합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 2조 (정의)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. "플랫폼"이란 회사가 제공하는 가사관리사 파견 중개 서비스를 말합니다.</p>
                <p className="font-medium mb-2 mt-4">2. "이용자"란 플랫폼을 이용하는 회원을 말합니다.</p>
                <p className="font-medium mb-2 mt-4">3. "가사관리사"란 플랫폼을 통해 파견되는 가사관리 전문가를 말합니다.</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 3조 (약관의 효력 및 변경)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 약관의 효력</p>
                <p className="leading-relaxed mb-2">
                  본 약관은 이용자가 회원가입을 완료한 시점부터 효력이 발생합니다.
                </p>

                <p className="font-medium mb-2 mt-4">2. 약관의 변경</p>
                <p className="leading-relaxed mb-2">
                  회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 웹사이트나 앱을 통해 공지합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 4조 (서비스 이용)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 서비스 이용 방법</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>이용자는 플랫폼을 통해 가사관리사를 검색하고 매칭을 신청할 수 있습니다.</li>
                  <li>매칭이 성공하면 가사관리사와 직접 계약을 체결하고 서비스를 이용할 수 있습니다.</li>
                </ul>

                <p className="font-medium mb-2 mt-4">2. 서비스 이용 제한</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>이용자는 관련 법령과 본 약관을 준수해야 합니다.</li>
                  <li>부정한 방법으로 서비스를 이용하는 경우 이용이 제한될 수 있습니다.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 5조 (이용자의 의무)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 이용자는 다음 행위를 해서는 안 됩니다.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>허위 정보를 등록하는 행위</li>
                  <li>타인의 정보를 도용하는 행위</li>
                  <li>서비스의 정상적인 운영을 방해하는 행위</li>
                  <li>가사관리사에게 부당한 요구를 하는 행위</li>
                </ul>

                <p className="font-medium mb-2 mt-4">2. 이용자의 책임</p>
                <p className="leading-relaxed mb-2">
                  이용자는 본인의 계정 관리에 대한 책임이 있으며, 계정의 부정 사용으로 인한 손해에 대해 회사는 책임지지 않습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 6조 (서비스 제공의 중단)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 서비스 중단 사유</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>시스템 점검, 보수, 교체 등의 경우</li>
                  <li>천재지변, 전기통신서비스 중단 등의 불가항력적 사유가 있는 경우</li>
                </ul>

                <p className="font-medium mb-2 mt-4">2. 서비스 중단 통지</p>
                <p className="leading-relaxed mb-2">
                  서비스 중단이 필요한 경우, 회사는 사전에 공지하거나 이용자에게 통지합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 7조 (회원 탈퇴)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 탈퇴 절차</p>
                <p className="leading-relaxed mb-2">
                  이용자는 언제든지 회원 탈퇴를 신청할 수 있으며, 탈퇴 신청 시 즉시 처리됩니다.
                </p>

                <p className="font-medium mb-2 mt-4">2. 탈퇴 후 처리</p>
                <p className="leading-relaxed mb-2">
                  탈퇴 후에는 서비스 이용이 불가능하며, 보관된 개인정보는 관련 법령에 따라 일정 기간 보관 후 파기됩니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제 8조 (분쟁 해결)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 분쟁 해결 방법</p>
                <p className="leading-relaxed mb-2">
                  서비스 이용과 관련하여 발생한 분쟁은 당사자 간의 협의를 통해 해결합니다.
                </p>

                <p className="font-medium mb-2 mt-4">2. 관할 법원</p>
                <p className="leading-relaxed mb-2">
                  협의가 이루어지지 않을 경우, 관련 법령에 따라 관할 법원을 통해 해결합니다.
                </p>
              </div>
            </div>

            {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500 text-sm">본 이용약관은 2024년 1월 1일부터 시행합니다.</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTerms; 