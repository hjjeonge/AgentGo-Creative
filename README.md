# Image Editor

브라우저에서 도형, 텍스트, 펜 드로잉을 편집할 수 있는 React 기반 이미지 에디터입니다.  
현재는 기본 편집 기능과 텍스트 스타일 조정을 중심으로 구현되어 있습니다.

## 주요 기능
- 펜/지우개/도형/텍스트 도구 제공
- 텍스트 스타일 편집(굵게, 기울임, 밑줄, 취소선)
- 글자색/배경색 선택 및 최근 색상 히스토리
- 외곽선/그림자 옵션 조정
- 선택/변형(크기 조절) 지원

## 기술 스택
- React + TypeScript + Vite
- Konva / react-konva
- Zustand
- Tailwind CSS
- Radix UI Select

## 시작하기
```bash
npm install
npm run dev
```

## 빌드/프리뷰
```bash
npm run build
npm run preview
```

## 폴더 구조
```
src/
  assets/          이미지/아이콘 리소스
  components/      UI 및 편집기 컴포넌트
    commons/       공용 컴포넌트
    editor/        에디터 핵심 UI/로직
    icons/         아이콘 컴포넌트
    ui/            UI 프리미티브
  pages/           라우팅 페이지
  store/           전역 상태 관리
  utils/           유틸리티 함수
```

## 실행 경로
- `/editor` 에디터 화면

## 참고
프로젝트 소개/데모 링크/기여 방법/라이선스 등은 필요에 따라 추가해 주세요.
