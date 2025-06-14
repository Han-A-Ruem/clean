import React from 'react';
import { PageHeader } from '../Utils';

const ManagerTerms = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50/80">
      <PageHeader title="매니저 이용약관" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      <div className="p-5">
        <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl border border-white/40 shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-5">매니저용 이용약관</h2>
          <div className="space-y-6 text-gray-700">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">(개요)</h3>
              <p className="leading-relaxed">
                약관은 계약의 당사자 간의 권한과 의무를 명시하고 신의성실의 원칙에 따라 공정하게 이루어져야하고 해석의 일관성이 유지되야한다
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제1조 (목적)</h3>
              <p className="leading-relaxed">
                이 약관은 '바쁠때'(이하 '회사')가 제공하는 모바일 애플리케이션 '바쁠때'를 설치하고 약관에 동의 절차를 거처 가입한 매니저 회원이 이용하는 서비스에 대한 권리, 의무, 책임 등을 규정하여 양 당사자 간의 원활한 계약을 체결하고 이행하기 위한 목적을 가지고 있습니다. 즉, 매니저가 청소 서비스를 제공할 수 있도록 규정된 조건을 다루고 있습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제2조 (용어)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 회사</p>
                <p className="leading-relaxed mb-2">
                  매니저 회원과 이용자를 연결하여 청소 서비스를 제공하는 플랫폼을 운영하는 사업체입니다. (부가서비스 포함)
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원의 가사서비스를 제공받기 원하는 이용자의 구인 신청을 받아 매니저회원과 연결해주는 서비스
                </p>

                <p className="font-medium mb-2 mt-4">2. 플랫폼</p>
                <p className="leading-relaxed mb-2">
                  회사가 운영하는 온라인 또는 모바일 기반의 서비스 연결 플랫폼을 의미합니다
                </p>

                <p className="font-medium mb-2 mt-4">3. 이용자</p>
                <p className="leading-relaxed mb-2">
                  청소 서비스를 요청하는 고객입니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사를 앱을 이용하여 가사서비스를 제공할 매니저 회원을 구인하는 개인(법인 제외) 혹은 사무실 청소를 이용하려고 하는 개인 또는 법인을 말합니다
                </p>

                <p className="font-medium mb-2 mt-4">4. 매니저 회원</p>
                <p className="leading-relaxed mb-2">
                  청소 서비스를 제공하는 사업자로서, 바쁠때와 계약을 체결하여 서비스를 제공하는 주체입니다.
                </p>
                <p className="leading-relaxed mb-2">
                  본 이용약관에 동의하고, 가사서비스 제공 구인신청을 한 이용자에게 구직승낙을 하고 가사서비스를 제공하는 개인 사업자 혹은 사무실 서비스 제공 구인 신청을 한 회사와 위탁 계약을 맺고 사무실 서비스를 제공하는 개인 사업자를 말합니다.
                </p>

                <p className="font-medium mb-2 mt-4">5. 서비스</p>
                <p className="leading-relaxed mb-2">
                  000회사가 제공하는 다양한 청소 서비스 (가사청소, 사무실 청소 등)입니다.
                </p>
                <p className="leading-relaxed mb-2">
                  "가사서비스"라 함은 바쁠때를 이용하여 매니저회원이 이용자의 구인신청을 승낙 후 해당 이용자에게 제공하는 서비스를 말합니다
                </p>

                <p className="font-medium mb-2 mt-4">6. 예약</p>
                <p className="leading-relaxed mb-2">
                  청소 서비스를 제공하기 위해 고객이 매니저 회원에게 예약 요청을 하는 행위입니다.
                </p>
                <p className="leading-relaxed mb-2">
                  "예약"이라 함은 이용자가 바쁠때에서 주소, 상품, 이용자에 대한 부가정보 등을 입력하고, 결제수단/쿠폰수단 등을 선택한 후 최종적으로 "예약" 버튼을 클릭하여 가사서비스를 제공할 매니저회원에 대한 구인신청을 바쁠때에 등록하는 것을 말합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  "단기예약"이라 함은 이용자가 매니저회원과 1회에 한한 가사서비스 이용계약을 체결하도록 예약하는 것을 말합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  "정기예약"이라 함은 이용자가 매니저회원과 1회를 초과한 다수의 가사서비스 이용계약을 한 번에 체결하도록 예약하는 것을 말합니다.
                </p>

                <p className="font-medium mb-2 mt-4">7. 매칭</p>
                <p className="leading-relaxed mb-2">
                  매니저회원이 바쁠때 매니저용 앱에서 이용자가 예약한 내용을 확인 후 선택하여 이용자와 매니저회원 간에 가사서비스 이용계약이 체결되는 것을 의미합니다.
                </p>

                <p className="leading-relaxed mt-4">
                  용어 중 본 조에서 정하지 아니한 부분은 관계법령 및 일반관례에 따릅니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제3조 (약관의 알림과 게시 및 개정)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  이 약관은 바쁠때의 앱이나 웹사이트에 게시됩니다. 만약 약관이 개정될 경우, 개정된 약관은 7일 전에 공지되며, 매니저 회원은 이를 확인하고 동의해야 합니다. 매니저회원에게 불리한 개정의 경우에는 적용일자 30일 전부터 공지합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원이 가입 시 제공한 휴대폰 전화번호로 SMS 내지 카카오톡 메시지 전송, 또는 바쁠때 서비스 이용 시 동의창 등의 전자적 수단을 통해 따로 명확히 통지하도록 합니다. 회사가 전항에 따라 개정 이용약관을 공지 또는 통지하면서 매니저회원에게 30일 기간 내에 거부의사를 표시하지 아니할 경우 이용약관 변경 내용에 동의한 것으로 본다는 뜻을 명확하게 공지 또는 통지하였음에도 매니저회원이 명시적으로 거부의 의사표시를 하지 아니한 경우 회사는 매니저회원이 개정 이용약관에 동의한 것으로 간주합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  만약 매니저 회원이 변경된 약관에 동의하지 않는 경우, 계약을 해지할 수 있으며, 해지에 따른 책임은 매니저 회원에게 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제4조 (서비스 회원 신청 및 승인)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  매니저 회원은 유효하고 정확한 신원 정보, 서비스 제공 가능한 지역, 및 서비스 조건 등을 바쁠때에 제출하고, 바쁠때는 이를 심사하여 승인을 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  승인이 되면 매니저 회원은 해당 플랫폼을 통해 서비스를 제공할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  바쁠때는 일정 수준의 가이드를 제시할 수 있으며 매니저 회원의 서비스 품질과 신뢰성 등을 고려하여 승인을 진행합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제5조 (서비스의 범주밎 내용)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 가사 서비스</p>
                <p className="leading-relaxed mb-2">
                  개인 가정에 대한 청소 서비스로, 매니저 회원과 이용자 사이의 계약을 통해 제공하는 청소 서비스입니다.
                </p>
                <p className="leading-relaxed mb-2">
                  가사 서비스 바쁠때는 직업안정법상의 유료직업소개업자로서 모바일 앱, 웹페이지 및 제휴된 업체의 서비스 신청을 통하여 매니저회원과 "이용자"를 연결해주는 중개서비스를 제공하는 것이며, 가사서비스 이용계약은 "이용자"와 매니저회원 사이에 체결됩니다.
                </p>

                <p className="font-medium mb-2 mt-4">2. 사무실 청소 서비스</p>
                <p className="leading-relaxed mb-2">
                  사업체와 계약된 매니저 회원이 사무실 등 비즈니스 공간에 대한 청소 서비스를 제공하는 내용입니다.
                </p>

                <p className="font-medium mb-2 mt-4">3. 기타 서비스</p>
                <p className="leading-relaxed mb-2">
                  이외에도 바쁠때는 매니저 회원이 제공할 수 있는 다양한 청소 서비스를 포함할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 회사의 플랫폼을 통해 자신이 제공할 수 있는 서비스 범위와 일정을 규정 안에서 자유롭게 설정할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제6조 (예약 및 취소)</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">1. 예약</p>
                <p className="leading-relaxed mb-2">
                  매니저 회원은 예약된 청소 서비스에 대해 사전에 확인하고, 이용자와의 계약을 체결합니다. 예약이 완료된 후, 매니저 회원은 청소 서비스를 성실히 제공해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원에게 이용자의 예약 정보를 제공하고, 매니저회원 본인이 이용자와의 가사서비스 이용계약 체결 여부를 직접 선택할 수 있도록 플랫폼을 제공이용자에게 전화 또는 메시지로 연락 이용자, 이용자 주소지, 가사서비스 요금 등 가사서비스 예약정보 확인매니저회원의 업무 수락을 통해 매니저회원과 회사 간에 위탁 계약을 체결합니다.
                </p>

                <p className="font-medium mb-2 mt-4">2. 취소</p>
                <p className="leading-relaxed mb-2">
                  예약된 서비스는 이용자나 매니저 회원에 의해 취소될 수 있으며, 취소 시 일정 수수료가 부과될 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  예를 들어, 청소 연기나 취소가 예약일 몇 시간 전에 이루어지면, 취소에 따른 일정한 요금이 발생할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매칭 완료 후 이용자의 예약 취소 요청 (이용자의 예약 취소는 매칭 완료 후부터 매니저회원이 서비스 제공을 위하여 이용자의 주소지에 도착하기 전까지의 기간에 이루어짐) 에 따른 매니저회원의 손해에 대해 회사는 별도 보상하지 않습니다. 다만, 이용자의 귀책에 의하여 이용자에게 취소수수료가 부과되는 경우 취소수수료의 일부를 매니저회원에게 지급할 수 있으며, 기타 일정한 요건 하에 별도의 보상방안을 매니저회원에게 제공할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제7조 (서비스 요금 및 정산)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  서비스 요금은 청소의 시간, 범위, 난이도 등을 고려하여 결정됩니다. 매니저 회원은 서비스가 완료된 후 바쁠때를 통해 요금을 정산하고, 정산된 금액을 지급받습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 고객에게 제공한 서비스에 대해 회사에서 정한 보상 체계에 따라 보수를 지급받을 권리가 있습니다. 보수는 회사가 정한 지급 주기와 방식에 따라 지급됩니다.
                </p>
                <p className="leading-relaxed mb-2">
                  바쁠때에 회원 가입을 함으로써 이러한 가격에 따를 것을 동의한 것으로 봅니다. 회사는 시장상황, 물가인상, 기타 경제적 요인을 고려하여 서비스 요금을 변경할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사는 이용자로부터 수령한 가사서비스 요금에서 이용자가 회사에 지불해야 하는 중개수수료를 공제한 가사서비스 요금을 전 항에 따라 매니저회원이 등록한 은행계좌로 지급합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  할인 쿠폰이나 프로모션 혜택이 적용될 경우, 매니저 회원은 이를 반영하여 요금을 계산합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제8조 (프로모션 및 혜택)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  프로모션: 바쁠때는 매니저 회원이 일정 조건을 만족할 때 혜택을 제공하는 프로모션을 운영할 수 있습니다. 예를 들어, 예약 횟수가 일정 수 이상일 경우 보상이나 할인 혜택을 제공할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저 회원은 잘못된 방법이나 부정한 방법으로 혜택을 받을 경우, 해당 혜택이 취소될 수 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제9조 (회원 탈퇴 및 계약 해지)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  매니저 회원은 언제든지 탈퇴 요청을 할 수 있으며, 탈퇴 시에는 바쁠때와 체결한 모든 계약이 종료됩니다.
                </p>
                <p className="leading-relaxed mb-2">
                  탈퇴 시 미결제 요금이 있을 경우 이를 정산하고, 매니저 회원의 정보는 삭제됩니다.
                </p>
                <p className="leading-relaxed mb-2">
                  계약해지는 매니저 회원이나 바쁠때에서 사전 통지 없이 즉시 이루어질 수 있으며, 이 경우 손해가 발생할 경우 책임을 물을 수 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제10조 (회사의 의무)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  바쁠때는 매니저 회원에게 필요한 정보를 제공하고, 서비스 운영에 있어 매니저 회원이 불편을 겪지 않도록 지원해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  또한, 바쁠때는 매니저 회원의 서비스 품질을 평가하여 문제를 해결할 의무가 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원과 이용자 간에 혹은 매니저회원과 회사 간에 발생하는 분쟁을 조정하기 위해 고객센터를 설치, 운영합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사는 매니저회원으로부터 제기되는 불만사항 및 의견이 정당하다고 판단되는 경우 이를 신속하게 처리하며, 즉시 처리가 곤란한 경우에는 그 사유와 처리기간을 통보합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  생활연구소는 이용자들이 바쁠때 서비스를 안심하고 이용하도록 하기 위하여 바쁠때 단체배상보험 등 관련 보험에 가입하고, 가입된 보험약관에 명시된 보험한도 내에서 보험약관에 따른 책임을 부담합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사는 매니저회원이 바쁠때를 안심하고 이용할 수 있도록 정보통신망법과 개인정보보호법 등 관련법령이 정하는 바에 따라 매니저회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 별도로 고지하는 [개인정보처리방침]을 통해 자세히 안내합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제11조 (매니저 회원의 의무)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  매니저회원은 서비스 품질을 유지하고, 고객의 요구에 맞는 서비스를 제공해야 합니다. 이때, 회사의 가이드라인 및 품질 기준을 준수해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저 회원은 정확한 서비스 정보를 제공하고, 청소 서비스를 성실히 제공해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  또한, 매니저 회원은 이용자와의 계약을 성실히 이행하며, 바쁠때의 규정을 준수해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 고객의 개인 정보 및 서비스 중 알게 된 정보를 외부에 유출하거나 불법적으로 사용할 수 없습니다. 개인정보 보호법을 준수하여 고객의 개인정보를 철저히 보호해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 다음 행위를 해서는 안 됩니다:
                </p>
                <ul className="list-disc pl-6 mb-2">
                  <li className="leading-relaxed mb-2">비정상적인 방법으로 서비스를 이용하거나 시스템에 접근하는 행위</li>
                  <li className="leading-relaxed mb-2">리버스엔지니어링, 디컴파일, 디스어셈블 및 기타 일체의 가공행위를 통하여 서비스를 복제, 분해 또는 모방 기타 변형하는 행위</li>
                  <li className="leading-relaxed mb-2">이용 신청 또는 변경 시, 허위 사실을 기재하거나 다른 매니저회원 및 이용자의 개인정보를 무단으로 수집하거나 부정하게 사용하는 행위</li>
                  <li className="leading-relaxed mb-2">바쁠때의 운영을 고의로 방해하는 행위</li>
                  <li className="leading-relaxed mb-2">자신의 부당한 이익을 위하거나 타인에게 손해를 가할 목적으로 허위의 정보를 유통시키는 행위</li>
                  <li className="leading-relaxed mb-2">본인 아닌 제3자에게 자신의 계정의 접속권한을 부여하거나 생활연구소의 사전 동의 없이 계정 및 본 이용약관에 따른 권리 또는 의무의 전부 또는 일부를 제3자에게 양도·임대하거나 담보로 제공하는 행위</li>
                  <li className="leading-relaxed mb-2">바쁠때 관련 가입된 단체보험 약관을 고의로 위반하거나, 부당한 목적으로 보험금을 취득하려는 행위가 적발된 경우</li>
                  <li className="leading-relaxed mb-2">이용자 또는 제3자에 대한 불법 또는 부당한 행위나 사회상규에 반하는 행위</li>
                  <li className="leading-relaxed mb-2">회사를 통해 연결된 이용자 또는 제3자와 직접계약하는 행위</li>
                  <li className="leading-relaxed mb-2">기타 불법적이거나 부당한 방법으로 회사의 업무를 방해하는 경우</li>
                </ul>
                <p className="leading-relaxed mb-2">
                  매칭 완료 후 부득이한 사유가 발생한 경우를 제외하고 매니저회원은 이용자와의 서비스 이용계약의 내용을 반드시 지켜야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  가입한 바쁠때 관련 단체보험의 피보험자로서 해당 보험약관을 준수할 의무가 있으며, 보험약관 위반으로 인해 발생하는 모든 법적 책임은 매니저회원 본인에게 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 바쁠때를 통한 서비스 제공 중 자신의 고의 또는 과실로 이용자 또는 제3자에게 손해를 발생시킨 경우 해당 손해에 대한 책임을 직접 부담하여야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 회사가 가입한 바쁠때 관련 단체보험의 적용이 가능한 경우 단체보험의 보장 한도 범위 내에서 이용자의 손해를 배상할 수 있습니다. 단, 보험약관에 따른 보험한도를 초과하는 손실에 대해서는 매니저회원이 직접 이용자에게 손해를 배상해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원이 바쁠때를 통한 서비스 제공 중 자신의 고의 또는 과실로 이용자 또는 제3자에게 손해를 발생시켰음에도 제5항 및 제6항에 따른 책임을 부담하지 않는 경우 회사는 보험 계약자로서 단체보험으로 처리를 할 수 있습니다. 단, 보험 처리로 발생하는 보험사에서 고지한 자기부담금은 매니저회원이 부담하여야 하며, 해당 금원을 회사에 지급하여야 합니다. 해당 금액 미납 시 바쁠때 이용에 제한을 받을 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 바쁠때를 통해 알게 된 고객 혹은 제3자 정보를 이용하여 직접계약 혹은 시도하는 행위를 하여서는 안 됩니다. 이와 같은 상황이 "회사"에 적발되거나 확인되었을 경우 금백만원(￦1,000,000)을 위약벌로 지급해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  매니저회원은 이용자의 거주지인 업무지에 사전에 이용자와 합의되지 않은 제3자를 동행하거나 대신 보낸 경우 무단 주거침입으로 처벌 받을 수 있음을 인지하여야 합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제12조 (청소 서비스 제공 기준)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  매니저 회원은 바쁠때가 제공하는 품질 기준에 맞춰 청소 서비스를 제공해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  청소 후 서비스 품질에 대한 이상이 발생하면, 매니저 회원은 보수 작업을 진행하거나 해결 방안을 마련해야 할 책임이 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제13조 (서비스에 대한 책임)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  매니저 회원은 서비스 제공 중 발생할 수 있는 손해나 문제에 대해 책임을 집니다.
                </p>
                <p className="leading-relaxed mb-2">
                  예를 들어, 서비스 도중 발생한 물품 손상이나 고객 불만에 대한 처리는 매니저 회원의 책임입니다.
                </p>
                <p className="leading-relaxed mb-2">
                  이 외에도 서비스 품질에 문제가 있을 경우, 이를 즉시 해결해야 할 의무가 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제14조 (바쁠때의 권리)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  회사는 매니저회원이 불법적인 행위를 하지 않도록 모니터링하고, 법적 책임이 발생할 수 있는 경우에는 이를 경고하거나 적절한 조치를 취할 권한이 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  바쁠때는 매니저 회원의 서비스 제공 여부를 확인하고, 불법적인 활동이 발생할 경우 서비스 이용을 제한할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  예를 들어, 서비스 중 부당한 행위나 불법적인 방법으로 서비스를 제공하면 바쁠때는 이를 조치할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제15조 (손해배상)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  매니저 회원은 서비스 제공 중 발생한 손해나 손실에 대해 배상할 책임이 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  예를 들어, 청소 중 발생한 물건 파손이나 고객의 불만이 있을 경우, 매니저 회원은 이를 배상해야 합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  바쁠때도 일부 경우에 대해서는 손해배상의 책임을 질 수 있습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제16조 (기타 사항)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  이 약관에 명시되지 않은 사항은 관련 법률에 따르며, 발생한 문제는 상호 협의하여 해결하도록 합니다.
                </p>
                <p className="font-medium mb-2 mt-4">(서비스의 중단)</p>
                <p className="leading-relaxed mb-2">
                  회사는 컴퓨터 등 정보통신설비의 보수·점검, 교체, 고장, 통신 두절, 천재지변 등 불가항력적인 사유가 발생한 경우, '바쁠때' 서비스 제공을 일시적으로 중단할 수 있으며, 이 경우 사전에 공지합니다.
                </p>
                <p className="leading-relaxed mb-2">
                  다만, 회사가 합리적으로 예측할 수 없는 사유로 인해 서비스가 중단된 경우에는 사후 공지를 할 수 있습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  이러한 사유로 인해 서비스가 중단되더라도, 회사에 중대한 과실이 없는 한 매니저 회원에게 손해배상 책임을 지지 않습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  또한, 회사는 사업적 판단에 따라 서비스의 제공을 중단할 수 있으며, 이로 인해 매니저 회원이 입을 수 있는 기대 이익의 손실에 대해서는 책임을 지지 않습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사는 서비스의 일시 정지 또는 중단 시, 매니저 회원에게 사전 공지하여 불이익을 최소화하기 위해 노력합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제17조 (회사의 면책)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  회사는 천재지변 또는 이에 준하는 불가항력적 사유, 정보통신설비의 보수·점검, 교체, 고장, 통신 두절 등으로 인해 일시적 또는 종국적으로 서비스를 제공할 수 없는 경우, 서비스 제공 의무에서 면책됩니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사는 매니저 회원의 귀책사유로 인한 서비스 이용 장애에 대해서는 책임을 지지 않으며, 매니저 회원이 '바쁠때'를 통해 기대하는 수익을 보장하지 않습니다.
                </p>
                <p className="leading-relaxed mb-2">
                  회사는 매니저 회원과 이용자 간, 또는 매니저 회원과 제3자 간의 분쟁에 개입하지 않으며, 도난, 폭행, 성범죄, 무단주거침입, 방조 등 '바쁠때' 이용과 직접적으로 관련 없는 매니저 회원 개인의 불법 행위나 사회상규에 반하는 행위에 대해서도, 회사에 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">제18조 (준거법 및 관할)</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  본 이용약관은 대한민국법에 의하여 해석되고 이행됩니다. 회사와 매니저회원 간에 발생한 일체의 분쟁은 대한민국법을 준거법으로 하며, 민사소송법 상의 주소지를 관할하는 법원을 합의관할로 합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">부칙</h3>
              <div className="pl-6">
                <p className="leading-relaxed mb-2">
                  본 약관은 2025년 4월 1일부터 시행합니다. (2025년 4월 1일 개정)
                </p>
                <p className="leading-relaxed mb-2">
                  단, 본 약관의 공지 이후 시행일 이전에 본 약관에 동의한 경우에는 동의 시부터 본 약관이 적용됩니다.
                </p>
                <p className="leading-relaxed mb-2">
                  또한, 매니저 회원과 바쁠때는 협력을 통해 서비스 개선 및 고객 만족을 위해 노력해야 합니다.
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

export default ManagerTerms; 