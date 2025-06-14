
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from '../Utils';

const FAQs = () => {
  const navigate = useNavigate();
  
  return (
    <div className="">
      <PageHeader title='자주 묻는 질문'/>

      <div className="p-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="cleaning-1">
            <AccordionTrigger>어떤 서비스를 제공하나요?</AccordionTrigger>
            <AccordionContent>
              기본 가사 청소 서비스에는 거실, 주방, 욕실, 방 등 주거 공간의 전반적인 청소가 포함됩니다. 바닥 청소, 먼지 제거, 쓰레기 비우기, 침구 정리,
              주방 및 욕실 청소 등을 제공합니다. 추가 서비스로는 냉장고 청소, 오븐 청소, 창문 청소 등이 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-2">
            <AccordionTrigger>서비스 가능지역은 어디인가요?</AccordionTrigger>
            <AccordionContent>
              현재 서울 전 지역, 경기도 일부 지역(성남, 안양, 수원, 부천, 고양, 용인)에서 서비스를 제공하고 있습니다. 
              점차 서비스 지역을 확대해 나갈 예정이니 앱에서 주소를 입력하시면 서비스 가능 여부를 확인하실 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-3">
            <AccordionTrigger>서비스 범위는 어떻게되나요?</AccordionTrigger>
            <AccordionContent>
              기본 서비스는 4시간 기준으로 33평 이하 주거 공간의 전체 청소를 포함합니다. 넓은 공간이나 특수 청소(입주 청소, 이사 청소 등)는 
              추가 시간이 필요할 수 있으며, 서비스 예약 시 선택 옵션을 통해 맞춤 서비스를 신청하실 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-4">
            <AccordionTrigger>서비스 요금은 어떻게 되나요?</AccordionTrigger>
            <AccordionContent>
              기본 4시간 청소 서비스는 80,000원부터 시작하며, 평수와 추가 옵션에 따라 요금이 달라질 수 있습니다. 
              정확한 견적은 앱에서 주소와 평수, 원하는 서비스를 선택하시면 자동으로 계산됩니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-5">
            <AccordionTrigger>전문가마다 서비스 요금이 왜 다른가요?</AccordionTrigger>
            <AccordionContent>
              전문가의 경력, 전문 분야, 서비스 평점 등에 따라 요금이 다르게 책정됩니다. 
              경력이 많고 좋은 평가를 받은 전문가는 보다 높은 서비스 품질을 제공하므로 요금이 다소 높을 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-6">
            <AccordionTrigger>반려동물이 있어요</AccordionTrigger>
            <AccordionContent>
              반려동물이 있는 가정도 서비스 이용이 가능합니다. 예약 시 반려동물 종류와 수를 기재해 주시면 
              알레르기가 없는 적합한 전문가를 배정해 드립니다. 서비스 진행 중에는 반려동물을 안전한 공간에 분리해두시는 것을 권장합니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-7">
            <AccordionTrigger>부재중일 때도 서비스가 가능한가요?</AccordionTrigger>
            <AccordionContent>
              네, 가능합니다. 예약 시 '부재중 서비스'를 선택하시고 출입 방법(디지털 도어락 비밀번호, 경비실 키 보관 등)을 기재해 주시면 됩니다. 
              서비스 완료 후 전문가가 사진과 함께 결과 보고서를 보내드립니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-8">
            <AccordionTrigger>전문가에게 남기고 싶은 말이 있어요.</AccordionTrigger>
            <AccordionContent>
              예약 시 '요청사항' 란에 전문가에게 전달할 내용을 자세히 기재해 주세요. 특별히 신경써야 할 부분이나 
              사용하지 말아야 할 제품 등 구체적인 요청사항을 남기실 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-9">
            <AccordionTrigger>다른 날짜로 일정을 변경하고 싶어요.</AccordionTrigger>
            <AccordionContent>
              예약 24시간 전까지는 앱에서 무료로 일정 변경이 가능합니다. '예약' 메뉴에서 해당 예약을 선택한 후 
              '일정 변경' 버튼을 통해 새로운 날짜와 시간을 선택하실 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-10">
            <AccordionTrigger>매주 서비스는 어떻게 결제가 진행되나요?</AccordionTrigger>
            <AccordionContent>
              정기 서비스는 첫 서비스 예약 시 등록한 결제 수단으로 자동 결제됩니다. 각 서비스 3일 전에 결제가 진행되며, 
              결제 완료 시 알림을 보내드립니다. 언제든지 앱에서 정기 서비스를 중단하거나 일시 정지할 수 있습니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-11">
            <AccordionTrigger>자동 결제 카드를 변경하고 싶어요.</AccordionTrigger>
            <AccordionContent>
              '더보기 &gt; 결제 수단 관리'에서 기존 카드를 삭제하고 새로운 카드를 등록하실 수 있습니다. 
              정기 결제 중인 서비스가 있다면 자동으로 새 카드로 결제 수단이 변경됩니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-12">
            <AccordionTrigger>시간을 연장하고싶어요.</AccordionTrigger>
            <AccordionContent>
              서비스 진행 중 시간 연장이 필요하시면, 앱에서 '시간 연장' 버튼을 통해 1시간 단위로 연장 신청이 가능합니다. 
              전문가의 다음 일정에 따라 연장이 어려울 수 있으니, 가능하면 미리 충분한 시간을 예약하시는 것을 권장합니다.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cleaning-13">
            <AccordionTrigger>예약 취소시, 위약금이 있나요?</AccordionTrigger>
            <AccordionContent>
              서비스 24시간 전까지 취소하시면 전액 환불됩니다. 24시간 이내 취소 시에는 50%의 위약금이 발생하며, 
              예약 시간 1시간 이내 또는 노쇼(No-show)의 경우 전액 위약금이 발생합니다. 정기 서비스는 다음 회차부터 취소 처리됩니다.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQs;
