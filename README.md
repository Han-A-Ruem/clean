
# 청소 서비스 관리 플랫폼

한국의 가정용 청소 서비스를 위한 종합 관리 플랫폼입니다. 고객과 청소 전문가를 연결하고, 예약 관리, 결제, 실시간 채팅 등의 기능을 제공합니다.

## 🚀 기능

### 고객용 기능
- **서비스 예약**: 정기/일회성 청소, 특별 청소 (주방, 화장실, 냉장고) 예약
- **일정 관리**: 달력 기반 예약 날짜 선택
- **실시간 추적**: 청소 진행 상황 실시간 모니터링
- **결제 시스템**: 토스페이먼츠 연동 안전한 결제
- **리뷰 시스템**: 서비스 완료 후 평점 및 후기 작성
- **채팅**: 청소 전문가와 실시간 소통
- **쿠폰 관리**: 할인 쿠폰 사용 및 관리
- **주소 관리**: 여러 주소 등록 및 관리

### 청소 전문가용 기능
- **일정 관리**: 배정된 청소 일정 확인
- **예약 검색**: 지역별, 날짜별 예약 검색
- **실시간 알림**: 새로운 예약 및 변경사항 알림
- **채팅**: 고객과 실시간 소통
- **수입 관리**: 정산 내역 및 수입 통계

### 관리자용 기능
- **사용자 관리**: 고객 및 청소 전문가 계정 관리
- **예약 관리**: 모든 예약 현황 모니터링
- **쿠폰 관리**: 프로모션 쿠폰 생성 및 배포
- **통계 대시보드**: 서비스 이용 현황 분석
- **공지사항**: 시스템 공지 및 이벤트 관리

## 🛠 기술 스택

### Frontend
- **React 18** - 모던 React with Hooks
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 서버 및 빌드
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트
- **React Router** - 클라이언트 사이드 라우팅
- **TanStack Query** - 서버 상태 관리
- **Framer Motion** - 애니메이션

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - 관계형 데이터베이스
- **Row Level Security** - 데이터 보안

## 📱 앱 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # shadcn/ui 기본 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   ├── home/           # 홈 화면 컴포넌트
│   ├── bookings/       # 예약 관리 컴포넌트
│   ├── search/         # 검색 관련 컴포넌트
│   ├── chat/           # 채팅 컴포넌트
│   ├── admin/          # 관리자 컴포넌트
│   └── menu/           # 메뉴 및 설정 컴포넌트
├── contexts/           # React Context 상태 관리
├── hooks/              # 커스텀 React Hooks
├── pages/              # 페이지 컴포넌트
├── routes/             # 라우팅 설정
├── services/           # API 서비스 레이어
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
└── integrations/       # 외부 서비스 연동
```

## 🚀 시작하기

### 필수 조건
- Node.js (v18 이상)
- npm 또는 yarn
- Supabase 계정

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
   - Supabase 프로젝트 생성
   - 환경 변수 설정 (Supabase URL, anon key 등)

4. **개발 서버 실행**
```bash
npm run dev
```

앱이 `http://localhost:5173`에서 실행됩니다.

## 📦 주요 의존성

### 핵심 라이브러리
- `react` & `react-dom` - React 프레임워크
- `typescript` - 타입 시스템
- `vite` - 빌드 도구
- `@supabase/supabase-js` - Supabase 클라이언트

### UI 및 스타일링
- `tailwindcss` - CSS 프레임워크
- `@radix-ui/*` - 접근성 우수한 UI 프리미티브
- `lucide-react` - 아이콘 라이브러리
- `framer-motion` - 애니메이션

### 상태 관리 및 데이터
- `@tanstack/react-query` - 서버 상태 관리
- `react-router-dom` - 라우팅
- `react-hook-form` - 폼 관리

## 🏗 아키텍처

### 상태 관리
- **React Context**: 전역 상태 (사용자, 예약, 알림)
- **TanStack Query**: 서버 상태 캐싱 및 동기화
- **Local Storage**: 클라이언트 지속성

### 데이터베이스 스키마
주요 테이블:
- `reservations` - 예약 정보
- `addresses` - 주소 정보
- `profiles` - 사용자 프로필
- `chats` & `chat_messages` - 채팅 시스템
- `coupons` - 쿠폰 관리
- `notifications` - 알림 시스템

### 보안
- Row Level Security (RLS) 정책으로 데이터 접근 제어
- JWT 기반 인증
- 역할 기반 권한 관리 (고객/청소 전문가/관리자)

## 🚀 배포

### Netlify 플랫폼 배포
1. Main 브랜치에 푸시하면 자동으로 배포됩니다

### 커스텀 도메인 연결
1. 유료 플랜 구독
2. Project > Settings > Domains에서 설정

### GitHub 연동
1. GitHub 버튼을 통해 저장소 연결
2. 자동 양방향 동기화
3. 외부 호스팅 서비스 활용 가능

## 🔧 개발 가이드

### 코드 스타일
- TypeScript strict 모드 사용
- Tailwind CSS 유틸리티 클래스
- 컴포넌트 분리 및 재사용성 고려
- React Hooks 패턴 준수

### 테마 시스템
- CSS 변수 기반 디자인 시스템
- 사용자/청소 전문가별 테마 분리
- 반응형 디자인 우선

### 성능 최적화
- 코드 분할 (Dynamic imports)
- 이미지 최적화
- React Query 캐싱 전략
