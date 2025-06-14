import React from 'react';
import { PageHeader } from '../Utils';

const PrivacyInfo = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50/80">
      <PageHeader title="이용약관" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      <div className="p-5">
        <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl border border-white/40 shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-5">이용약관</h2>
          <div className="space-y-4 text-gray-700">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">개요 및 목적</h3>
              <p className="leading-relaxed">
                본 이용약관은 바쁠때 가사청소 중개 서비스 및 이사/입주청소 서비스 (이하 "바쁠때"라 한다)의 이용을 위해, '바쁠때' 모바일 어플리케이션을 설치하고 가입한 이용자 회원 (이하 "이용자 회원"이라 한다)과 바쁠때 (이하 "회사"라 한다) 간의 계약 관계를 명확히 하기 위해 작성되었습니다.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">약관의 효력 및 변경</h3>
              <p className="leading-relaxed">
                이용자가 바쁠때를 이용하기 전에 본 이용약관의 내용을 확인하고 이에 동의해야 합니다. 바쁠때는 관련 법령에 위배되지 않는 범위 안에서 본 이용약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 서비스 내에 공지함으로써 효력이 발생합니다.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">약관 용어의 정의</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>"바쁠때"는 회원이 PC, 휴대전화 등을 통하여 회사가 제공하는 모든 서비스를 이용할 수 있도록 하는 일체의 어플리케이션을 의미합니다.</li>
                <li>"이용자(고객) 회원"은 바쁠때를 이용하여 가사서비스를 제공할 매니저 회원을 구인하는 개인(법인 제외)을 의미합니다.</li>
                <li>"매니저(가사관리사) 회원"은 가사서비스 제공 구인신청을 한 이용자에게 구직 승낙을 하고 가사서비스를 제공하는 개인 사업자를 의미합니다.</li>
                <li>"가사서비스"는 가사서비스를 제공받기 원하는 이용자 회원의 구인신청을 받아 매니저 회원과 연결해주는 중개서비스를 의미하며, 이와 관련된 각종 부가 서비스를 포함합니다.</li>
                <li>"예약"은 이용자가 바쁠때에서 주소, 상품, 이용자에 대한 부가 정보 등을 입력하고, 결제수단/쿠폰 수단 등을 선택한 후 최종적으로 "예약" 버튼을 클릭하여 가사서비스를 제공할 매니저 회원에 대한 구인신청을 청소연구소에 등록하는 것을 의미합니다.</li>
                <li>"단기 예약"은 이용자가 매니저 회원과 1회에 한한 가사서비스 이용계약을 체결하도록 예약하는 것을 의미합니다.</li>
                <li>"정기 예약"은 이용자가 매니저 회원과 1회를 초과한 다수의 가사서비스 이용계약을 한 번에 체결하도록 예약하는 것을 의미합니다.</li>
                <li>"자동 결제"는 최초 신용카드 등의 카드 정보를 입력 후 이후 요금이 결제될 때마다 별도의 인증 과정 없이 자동으로 결제되는 것을 의미합니다.</li>
                <li>"카드 결제"는 신용카드 등의 카드 정보를 입력하여 요금을 결제하는 것을 의미합니다.</li>
                <li>"쿠폰"은 바쁠때가 프로모션 용도로 회원에게 제공하는 것으로서, 정해진 조건에 따라 바쁠때 서비스 이용요금의 전부 또는 일부를 할인 받을 수 있는 이용권을 의미합니다.</li>
                <li>"포인트"는 바쁠때에서 청소 서비스 예약을 위해 사용되는 수단으로 카드 결제 등으로 직접 구매하거나 당사와 제휴사에서 주최하는 이벤트 등을 통해 충전한 포인트를 의미합니다.</li>
                <li>"무료 포인트"는 회원의 구매 없이 이벤트 및 제휴사로부터 무료 제공된 포인트를 의미합니다.</li>
                <li>"유료 포인트"는 카드 결제, 포인트 교환권 등 회원의 구매로 충전된 포인트를 의미합니다.</li>
                <li>"포인트 교환권"은 카드 결제 등으로 직접 구매하거나 당사와 제휴사에서 주최하는 이벤트 등을 통해 제공받은 것으로서, 포인트를 충전할 수 있는 포인트 교환 수단을 의미합니다.</li>
                <li>"예약 취소"는 서비스 진행 전까지 예약을 철회하는 것을 의미합니다.</li>
                <li>"취소 수수료"는 청소연구소 서비스를 예약한 후 철회한 경우에 부과되는 위약금을 의미합니다.</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">약관의 개정 및 개시사항</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>이용약관의 게시: 바쁠때는 본 이용약관을 바쁠때 내에 항상 게시합니다.</li>
                <li>이용약관 개정: 바쁠때는 사업 정책, 서비스 환경의 변화, 법령 개정 등 필요한 경우 이용약관을 개정할 수 있습니다. 개정 시 적용일자와 개정 사유를 명시하고, 바쁠때 내 적절한 장소에 개정약관을 7일 전부터 공지합니다. 불리한 변경의 경우 30일 전부터 공지하고, SMS나 카카오톡 등으로 명확히 통지합니다.</li>
                <li>동의 여부: 개정된 약관에 대해 이용자가 30일 이내에 거부 의사를 표명하지 않으면, 개정된 약관에 동의한 것으로 간주됩니다.</li>
                <li>동의하지 않은 경우: 이용자가 개정된 약관에 동의하지 않으면 기존 약관이 적용되며, 특별한 사정이 있는 경우 바쁠때는 이용자와의 계약을 해지할 수 있습니다.</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">이용자 회원에 대한 통지</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>특정 이용자 회원에 대한 통지: 바쁠때는 특정 이용자에게 통지가 필요할 경우, 이용자가 제공한 전화번호로 전화, SMS, 카카오톡, 또는 앱 내 메시지를 통해 직접 통지할 수 있습니다.</li>
                <li>불특정 다수 이용자 회원에 대한 통지: 다수 이용자에 대해 통지가 필요한 경우, 바쁠때 앱 내에 공지하여 개별 통지를 대체할 수 있습니다. 그러나 이용자의 거래에 중대한 영향을 미치는 사항에 대해서는 개별 통지를 합니다.</li>
                <li>연락처 미기재 및 변경 미수정: 이용자가 연락처를 미기재하거나 변경 후 미수정으로 인해 통지되지 않은 경우, 바쁠때는 과실 없이 통지된 내용의 확인을 못하거나 하지 않아 발생한 불이익에 대해 책임지지 않습니다.</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">서비스 이용</h3>
              <p className="leading-relaxed">
                이용자는 바쁠때에서 제공하는 다양한 가사 서비스를 이용할 수 있습니다. 서비스 이용과 관련된 세부 사항 (예약, 결제, 이용 취소 등)은 각 서비스별 안내 및 이용약관에 따릅니다.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">이용신청</h3>
              <p className="leading-relaxed mb-2">
                바쁠때 서비스를 이용하려면 정확하고 유효한 정보를 제공하여 신청해야 합니다. 필요한 정보와 관련된 가이드는 바쁠때 이용자회원용 모바일 앱에 게시된 "운영가이드"를 참고해야 합니다.
              </p>
              <div className="pl-6">
                <p className="font-medium mb-2">가입 제한 사유:</p>
                <p className="mb-2">다음과 같은 경우 가입이 제한될 수 있으며, 가입 후에도 확인되는 경우 이용이 제한되거나 회원 자격이 철회될 수 있습니다:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>19세 미만이거나 법정대리인의 동의 없이 개인정보 제공</li>
                  <li>사업자로 밝혀진 경우</li>
                  <li>허위 기재나 허위 서류 제출</li>
                  <li>이용정지 중 재가입 시도</li>
                  <li>기타 위법하거나 부당한 가입신청</li>
                  <li>사회질서나 미풍양속에 반할 우려가 있는 경우</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">본인인증 및 승낙</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>본인 인증: 이용신청 시 실명확인이나 본인인증을 요청할 수 있습니다.</li>
                <li>승낙 유보: 서비스 관련 설비의 여유가 없거나 기술적/업무상 문제가 있는 경우, 이용신청을 유보할 수 있습니다.</li>
                <li>신청자 알림: 신청이 거부되거나 유보된 경우, 부득이한 사유가 없다면 신청자에게 알릴 의무가 있습니다.</li>
                <li>매칭 처리: 이용자와 매니저의 의사에 따라 정기 예약이 유효하게 처리될 수 있습니다.</li>
                <li>정보 제공: 바쁠때를 통해 예약이 이루어지면 서비스 당사자 간 원활한 의사소통을 위해 필요한 범위 내에서 관련 정보를 제공할 수 있습니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">가사서비스 중개서비스의 내용</h3>
              <p className="leading-relaxed mb-2">
                바쁠때는 직업안정법에 따라 유료직업소개업자로서, 모바일 앱을 통해 이용자회원과 "매니저"를 연결하는 중개서비스를 제공합니다. 가사서비스 이용계약은 "매니저"와 이용자회원 간에 체결됩니다.
              </p>
              <div className="pl-6">
                <p className="font-medium mb-2">중개서비스의 구체적인 내용:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>이용자의 예약 요청 확인</li>
                  <li>이용자에게 전화 또는 메시지로 연락</li>
                  <li>이용자, 주소지, 가사서비스 요금 등의 예약정보 확인</li>
                  <li>가사서비스 요금 결제 확인</li>
                  <li>요금 정산 내역 확인 (업무 요금, 프로모션 혜택 등)</li>
                  <li>업무 이력 확인</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">서비스 변경</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>서비스 변경 가능성: 추가 서비스 항목이 있을 수 있으며, 그에 대해서도 동일한 이용약관이 적용됩니다. 기술적 사양이나 사업 정책에 따라 서비스 내용이 변경될 수 있으며, 변경사항은 7일 전에 공지됩니다. 불가피한 사유가 있을 경우 공지 기간을 단축할 수 있습니다.</li>
                <li>서비스 변경에 대한 동의: 이용자는 서비스 변경에 동의하지 않으면 탈퇴 의사를 고지하여 바쁠때에서 탈퇴할 수 있습니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">예약 및 취소 환불</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>서비스 예약 전 조건 확인: 이용자는 서비스를 예약하기 전에 조건을 확인해야 하며, 이를 확인하지 않고 발생한 손해에 대한 책임은 본인이 집니다.</li>
                <li>예약 방식: 바쁠때 서비스 예약은 모바일 앱을 통해서만 가능하고, 예약 가능한 시간은 서비스 시작 시간과 이동시간 등을 고려해 제한될 수 있습니다.</li>
                <li>예약금: 예약금은 매니저 및 프로 회원과 이용자회원 간 동의된 정책에 따라 책정됩니다.</li>
                <li>예약금 결제: 이용자는 예약 시 예약금을 확인하고 결제할 수 있습니다.</li>
                <li>수수료: 청소연구소는 이용자회원으로부터 일정 비율의 수수료를 취득합니다. 이 수수료에는 운영비용과 관련된 비용이 포함됩니다.</li>
                <li>할인 적용: 바쁠때는 이용자회원에게 할인쿠폰, 적립금 등을 통해 요금을 할인할 수 있으며, 그 할인액은 플랫폼 수수료에서 차감됩니다.</li>
                <li>취소 및 환불: 취소 및 환불 규정은 전자상거래법을 준수하며, 서비스가 진행된 경우 예약금은 환불되지 않습니다.</li>
                <li>서비스 제공 불가: 예약 후 매니저 회원이나 프로 회원이 취소하거나 나타나지 않는 경우에는 별도 보상이 없으며, 청소연구소는 최선의 노력을 다해 스케줄을 유지하려고 합니다.</li>
                <li>취소 수수료 및 환불: 서비스 취소 시 취소 수수료가 발생할 수 있으며, 환불은 결제 수단에 따라 이루어집니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">서비스 요금, 결제 등</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>서비스 요금: 서비스 요금은 업무 시간, 업무 강도, 시장 가격 등을 고려하여 생활연구소가 정한 기준에 따라 책정됩니다. 이용자는 이를 동의하고 가입합니다.</li>
                <li>요금 변경: 시장 상황, 물가 인상 등 경제적 요인을 고려해 서비스 요금이 변경될 수 있으며, 변경 사항은 사전에 이용자에게 고지됩니다.</li>
                <li>결제 방법: 바쁠때는 안전하고 편리한 결제를 위해 자동 결제 및 카드 결제를 제공합니다.</li>
                <li>예약금 결제: 이사/입주청소의 경우 예약 후 예약금 결제가 완료되지 않으면 예약이 취소될 수 있습니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">자동결제 규정</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>자동결제에 동의한 이용자는 별도의 인증 없이 결제 의사를 표시한 것으로 간주됩니다.</li>
                <li>결제 시 적법한 결제수단을 사용해야 하며, 결제수단의 유효성 검사를 통해 서비스 이용이 제한될 수 있습니다.</li>
                <li>신용카드 유효성 문제로 결제 실패 시 다른 결제 수단을 사용해 추후 결제를 진행해야 합니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">미수금 처리</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>결제 실패 시 미수금 처리되며, 이 미수금이 해결될 때까지 서비스 이용이 제한됩니다.</li>
                <li>미수금 발생 시 다른 결제수단으로 자동 재결제 시도할 수 있습니다.</li>
                <li>미수금이 해결되지 않으면 이용자가 탈퇴할 수 없습니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">이용자의 의무 및 책임</h3>
              <p className="leading-relaxed">
                이용자는 서비스를 이용하면서 관련 법령, 이용약관, 기타 회사가 고지하는 사항을 준수해야 합니다. 회사는 이용자의 부적절한 행위나 약관 위반에 대해 책임을 지지 않습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">개인 정보 보호</h3>
              <p className="leading-relaxed">
                회사는 이용자의 개인 정보 보호를 위해 최선을 다하며, 관련 법령 및 개인 정보 처리 방침을 준수합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">서비스의 변경 및 중단</h3>
              <p className="leading-relaxed">
                회사는 필요한 경우 서비스의 내용을 추가 또는 변경할 수 있으며, 서비스 제공의 중단이 불가피한 경우에는 사전 또는 사후에 이용자에게 공지합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">분쟁 해결</h3>
              <p className="leading-relaxed">
                서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁은 상호 협의를 통해 해결하도록 노력하며, 필요한 경우 관련 법령 및 일반 상관례에 따라 해결할 수 있습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">파손 등의 배상</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>파손, 분실 등의 사고 시 바쁠때는 원칙적으로 배상의 책임이 없으며 관련한 모든 사항은 계약된 보험사의 보험 약관에 따릅니다.</li>
                <li>이용자 회원은 홈페이지에 고지한 파손, 분실 관련 "주의의무"를 다해야 하며 귀중품의 도난, 분실, 파손을 막기 위해 사전에 철저한 보관, 관리 작업을 진행하여야 합니다. 해당 의무를 다하지 않을 시 입은 어떠한 금전적 손해에 대해서도 바쁠때는 배상할 책임이 없습니다.</li>
                <li>보험 처리는 서비스 당일 기준 7일(영업일 기준) 내에 요청해야 하며, 요청 후엔 요청일 기준 30일(영업일 기준) 이내에 자료 제출이 된 경우에만 처리가 가능합니다.</li>
                <li>매니저 회원이 행한 절취/도난사고에 대해 관계당국의 형사적 처벌이 확정된 경우, 이용자회원이 입은 물적 손해에 대해 보험사에서 손해사정 절차를 거쳐 평가한 금액을 이용자회원에게 지급합니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">쿠폰, 포인트 및 프로모션에 관한 혜택 제공</h3>
              <p className="leading-relaxed mb-2">
                이용자 활동에 따라 쿠폰, 포인트 등 혜택을 제공할 수 있으며, 조건과 세부사항은 별도로 공지됩니다.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>정보 오류로 인한 지급 문제: 이용자가 잘못된 정보를 입력해 혜택을 받지 못할 경우, 지급 유효 기간은 30일로 제한됩니다.</li>
                <li>혜택 지급 제한: 아래의 경우 혜택을 받을 수 없거나, 이미 받은 혜택을 반환해야 할 수 있습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>약관 위반으로 혜택을 받은 경우</li>
                    <li>바쁠때에 피해를 줄 우려가 있는 행위로 혜택을 받은 경우</li>
                    <li>혜택 조건을 충족하지 않거나 위반하여 혜택을 받은 경우</li>
                    <li>부정한 방법으로 혜택을 받은 경우</li>
                  </ul>
                </li>
                <li>쿠폰 사용 조건: 쿠폰은 지정된 사용 기간 내에만 사용할 수 있으며, 이용자가 탈퇴하면 미사용 쿠폰은 삭제됩니다. 또한 쿠폰의 대여, 양도, 매매는 금지됩니다.</li>
                <li>포인트 사용: 포인트는 일정 조건을 충족해야 사용할 수 있으며, 사용은 매니저회원이 제공하는 가사 서비스 요금 결제 시 가능합니다. 포인트의 적립 및 소멸에 관한 정보는 앱을 통해 확인할 수 있습니다.</li>
                <li>부정적립 및 부정사용 방지: 포인트를 부정하게 적립하거나 사용한 경우, 해당 포인트는 소멸되고 법적 책임을 질 수 있습니다.</li>
                <li>쿠폰과 포인트 환불 불가: 이벤트나 마케팅 활동으로 제공된 무료 포인트는 현금으로 전환하거나 환불할 수 없습니다.</li>
                <li>회원탈퇴 및 자격상실 시 포인트 처리: 탈퇴하거나 자격상실 시, 추가로 제공된 무료 포인트는 자동 소멸되며 복구되지 않습니다. 부정 적립된 포인트는 소멸되고, 이를 통해 제공된 서비스에 대한 부당이익은 환수될 수 있습니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">회원 탈퇴 및 이용계약의 해지</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">회원 탈퇴:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>이용자는 언제든지 모바일 앱에서 직접 탈퇴 신청할 수 있습니다.</li>
                  <li>탈퇴 신청은 철회할 수 없으며, 즉시 탈퇴 처리됩니다. 다만, 아래 경우에는 문제 해결 후에 탈퇴 처리가 이루어집니다:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>분쟁이 해결되지 않은 경우</li>
                      <li>이용계약의 서비스가 완료되지 않은 경우</li>
                    </ul>
                  </li>
                  <li>탈퇴 후, 개인정보 처리방침에 따라 필요한 정보 외의 모든 회원 정보는 즉시 삭제됩니다. 단, 영구 이용 제한을 받은 회원의 제재 이력은 계속 보관됩니다.</li>
                </ul>
              </div>
              <div className="pl-6 mt-4">
                <p className="font-medium mb-2">탈퇴로 인한 책임:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>탈퇴로 인해 발생하는 불이익은 회원이 부담해야 하며, 바쁠때는 제공한 무상 혜택을 회수할 수 있습니다.</li>
                </ul>
              </div>
              <div className="pl-6 mt-4">
                <p className="font-medium mb-2">바쁠때의 해지:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>바쁠때가 이용계약을 해지할 경우, 해지 사유를 앱 알림 등을 통해 회원에게 통지하고, 일정 기간 이의 신청 기회를 부여합니다. 단, 약관에 명시된 사유가 있을 경우 이의 신청 기간 없이 해지할 수 있습니다.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">바쁠때의 의무</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>서비스 제공 의무: 바쁠때 회사는 바쁠때 앱서비스를 제공하기 위해 관련 법령과 이용약관을 준수하고, 안정적인 운영을 통해 회원에게 이익을 제공하도록 최선을 다합니다.</li>
                <li>보험 가입 의무: 바쁠때 회사는 이용자들이 바쁠때 앱 서비스를 안심하고 이용할 수 있도록 단체배상보험에 가입하고, 해당 보험 약관에 따라 책임을 집니다.</li>
                <li>개인정보 보호 의무: 바쁠때는 이용자들의 개인정보를 보호하기 위해 관련 법령을 준수하고, 개인정보 처리 방침을 통해 상세히 안내합니다.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">이용자 회원의 의무</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>이용 범위 준수: 이용자는 0000회사가 허용하는 범위 내에서 바쁠때를 이용해야 하며, 법령과 이용약관, 운영가이드를 준수해야 합니다.</li>
                <li>금지된 행위: 이용자는 다음과 같은 행위를 할 수 없습니다:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>비정상적인 방법으로 서비스 이용 및 시스템 접근</li>
                    <li>리버스 엔지니어링, 디컴파일 등의 가공 행위</li>
                    <li>허위 정보 제공 및 개인정보 무단 수집</li>
                    <li>부정거래 및 비정상적인 결제</li>
                    <li>서비스 이용 목적을 가장하여 부당하게 이득을 취하는 행위</li>
                    <li>매니저와의 직접 거래 및 불법적인 홍보 활동 등</li>
                  </ul>
                </li>
            </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">약관의 해석</h3>
              <p className="leading-relaxed">
                본 이용약관에서 정하지 않은 사항이나 해석에 대해서는 관련 법령 및 일반 상관례에 따릅니다.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">이용 제한 및 계약 해지</h3>
              <p className="leading-relaxed">
                이용자가 위반할 경우, 바쁠때 회사는 서비스 이용을 제한하거나 계정 자격을 정지시킬 수 있습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">서비스의 중단</h3>
              <div className="pl-6">
                <p className="font-medium mb-2">불가항력적인 사유로 서비스 중단:</p>
                <p className="leading-relaxed mb-2">
                  생활연구소는 컴퓨터 시스템 점검, 고장, 통신두절, 천재지변 등 불가항력적인 이유로 서비스를 일시 중단할 수 있습니다. 이 경우 사전 공지가 이루어지며, 예측할 수 없는 사유로 서비스가 중단되면 사후에 공지할 수 있습니다. 이러한 상황에서 바쁠때는 중대한 과실이 없는 한 손해배상 책임을 지지 않습니다.
                </p>

                <p className="font-medium mb-2">천재지변 등 불가항력적 상황:</p>
                <p className="leading-relaxed mb-2">
                  천재지변, 전쟁, 폭동, 해킹, DDOS 공격 등으로 서비스가 중단되면 즉시 공지되며, 만약 공지가 불가능한 경우, 문제가 해결된 후 즉시 공지합니다.
                </p>

                <p className="font-medium mb-2">사업적 판단에 의한 서비스 중단:</p>
                <p className="leading-relaxed">
                  바쁠때는 사업적 판단에 따라 서비스를 중단할 수 있으며, 이에 대해 책임을 지지 않습니다. 서비스 중단 시 이용자에게 사전 공지를 하여 불이익을 최소화하려고 노력합니다.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">면책 조항</h3>
              <p className="leading-relaxed mb-2">
                회사는 법적 책임의 한계 내에서 서비스 제공과 관련하여 발생하는 문제에 대해 책임을 집니다. 다만, 이용자의 귀책사유로 인한 문제나 불가항력적인 사유로 인한 서비스 중단에 대해서는 책임을 지지 않습니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">바쁠때의 면책</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>불가항력적 사유에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>법령 변경, 천재지변, 정보통신설비 문제 등으로 인해 서비스 제공이 불가능한 경우, 바쁠때는 서비스 제공에 관한 책임에서 면제됩니다.</li>
                  </ul>
                </li>
                <li>이용자 귀책사유에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>이용자 회원의 귀책사유로 인해 서비스 이용에 장애가 생길 경우, 바쁠때는 이에 대해 책임을 지지 않습니다.</li>
                  </ul>
                </li>
                <li>서비스 중개 역할:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 이용자와 매니저 간의 거래를 중개하는 역할을 합니다. 그러나 바쁠때는 대리하지 않으며, 거래와 관련된 모든 법적 책임은 거래 당사자가 직접 부담합니다.</li>
                  </ul>
                </li>
                <li>이용자와 매니저 간 거래에 대한 책임:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>이용자와 매니저 간의 거래에서 발생하는 모든 문제나 분쟁은 해당 거래 당사자들이 직접 책임을 집니다.</li>
                  </ul>
                </li>
                <li>개인정보 유출에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>이용자 회원이 자신의 개인정보를 타인에게 제공하거나, 관리 소홀로 인해 개인정보가 유출되었을 경우, 그로 인해 발생하는 피해에 대해서 바쁠때는 책임을 지지 않습니다.</li>
                  </ul>
                </li>
                <li>제3자와의 거래에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 서비스 화면에서 링크나 배너 등을 통해 연결된 제3자와의 거래에 개입하지 않으며, 해당 거래에 대해서는 책임을 지지 않습니다.</li>
                  </ul>
                </li>
                <li>거래의 진정성 및 법적 문제에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 이용자와 매니저 간의 거래에 대해 진정성, 품질, 안전성, 적법성 등을 보증하지 않습니다.</li>
                  </ul>
                </li>
                <li>서비스 관련 정보의 신뢰성에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 이용자가 서비스에 게시한 정보나 자료의 정확성, 신뢰성에 대해 책임을 지지 않습니다.</li>
                  </ul>
                </li>
                <li>직접적이지 않은 분쟁에 대한 면책:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 이용자와 매니저 간의 분쟁이나, 이용자와 제3자 간의 분쟁, 또는 이용자의 불법행위와 관련된 사항에 대해 책임을 지지 않습니다.</li>
                  </ul>
                </li>
            </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">게시물 관리</h3>
              <p className="leading-relaxed mb-2">
                회원이 게시한 게시물로 인해 발생하는 결과에 대한 책임은 회원 본인에게 있습니다. 회사는 게시물이 다음 각 호의 내용에 해당한다고 판단되는 경우, 게시자에게 사전 통지 없이 게시물을 삭제하거나 게시자의 회원 자격을 제한할 수 있습니다.
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>회사, 다른 회원 또는 제3자를 비방하거나 명예를 훼손하는 경우</li>
                <li>공공질서 및 미풍양속에 위반되는 저작권, 제3자의 저작권 등 기타 권리를 침해하는 경우</li>
                <li>불법물, 음란물 또는 청소년 유해 매체물을 게시하거나 게시물을 음란 사이트와 연결하는 경우</li>
                <li>회사 또는 기타 제3자의 저작권 등 기타 권리를 침해하는 경우</li>
                <li>범죄 행위와 관련되거나 범죄 행위를 유발할 수 있다고 판단되는 경우</li>
                <li>회사의 명칭으로 게시되었으나 회사와 관련이 없는 경우</li>
                <li>정당한 사유 없이 회사의 영업을 방해하는 내용을 기재하는 경우</li>
                <li>게시판의 성격에 부합하지 않거나 게시물의 의도와 다른 경우</li>
                <li>기타 관련 법령 및 회사의 운영정책 등에 위반된다고 판단되는 경우</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">손해 배상 및 분쟁 해결</h3>
              <p className="leading-relaxed">
                이용자의 약관 위반으로 회사에 손해가 발생한 경우, 이용자는 회사에 손해를 배상해야 합니다. 서비스 이용 중 발생한 분쟁은 대한민국 법률에 따라 해결합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">약관의 효력</h3>
              <p className="leading-relaxed">
                본 약관은 이용자가 약관에 동의한 날로부터 효력이 발생하며, 회원 탈퇴 시까지 유지됩니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">회사의 연락처 및 정보</h3>
              <p className="leading-relaxed">
                회사의 상호, 주소, 연락처 등은 서비스 내에 게시하거나 별도로 제공합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">회원 정보 변경</h3>
              <p className="leading-relaxed">
                회원은 언제든지 자신의 회원 정보를 열람하고 수정할 수 있습니다. 회원은 회원 정보가 변경된 경우 지체 없이 회사에 변경사항을 알려야 합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">약관의 해석 및 개정</h3>
              <p className="leading-relaxed">
                회사는 약관의 규제에 관한 법률, 전자거래기본법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 서비스 내에 공지합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">분쟁 조정 절차</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>바쁠때는 이용자 회원과 매니저 회원 또는 이용자 회원과 바쁠때 간에 발생하는 분쟁을 조정하기 위해 고객센터(0000-0000)를 설치하고 운영합니다. 이를 통해 이용자는 분쟁 해결을 위한 지원을 받을 수 있습니다.</li>
                <li>불만사항 접수 기한:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>이용자 회원은 서비스 제공일로부터 7일(영업일 기준) 이내에 불만사항과 관련된 의견을 바쁠때에 요청해야 합니다.</li>
                    <li>요청일로부터 15일(영업일 기준) 이내에 필요한 자료를 제출해야만 처리됩니다.</li>
                  </ul>
                </li>
                <li>불만 처리:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 이용자 회원의 불만사항과 의견이 정당하다고 판단되면 이를 신속하게 처리합니다.</li>
                    <li>만약 즉시 처리하기 어려운 경우, 그 사유와 처리 기간을 이용자에게 통보합니다.</li>
                  </ul>
                </li>
                <li>분쟁 해결을 위한 지원:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>바쁠때는 접수된 분쟁을 원만히 해결하기 위해 최선을 다하며, 필요한 경우 공정거래위원회나 분쟁조정기관의 조정 신청을 이용자에게 안내할 수 있습니다.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">준거 및 관할</h3>
              <p className="leading-relaxed mb-2">
                본이용약관은 대한민국 법에 의하여 해석되고 이행됩니다.
              </p>
              <p className="leading-relaxed">
                바쁠때와 이용자 회원 간에 발생한 일체의 분쟁은 대한민국 법을 준거법으로 하며, 민사소송법 상의 주소지를 관할하는 법원을 합의관할로 합니다.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">부칙</h3>
              <p className="leading-relaxed">
                본약관은 0000년 0월 0일부터 시행합니다. (2024년 0월 0일 개정) 단, 본 약관의 공지 이후 시행일 이전에 본 약관에 동의한 경우에는 동의 시부터 본 약관이 적용됩니다.
              </p>
            </div>

            {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500 text-sm">본 약관은 2024년 1월 1일부터 시행합니다.</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyInfo;
