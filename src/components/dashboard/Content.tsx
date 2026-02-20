import type React from "react";
import { Template } from "./Template";
import { useNavigate } from "react-router-dom";

export interface Template {
  icon: string;
  title: string;
  comment: string;
}

const list: Template[] = [
  {
    icon: "sns",
    title: "SNS/마케팅광고 소재",
    comment:
      "브랜드 캠페인, 프로모션 등 마케팅 목적의 SNS피드, 배너, 썸네일 등 즉시 활용 가능한 광고 소재 생성",
  },
  {
    icon: "catalog",
    title: "상세페이지/카탈로그 생성",
    comment: "제품 배치, 공간 연출 등 실제 사용 환경을 표현한 상세 이미지 생성",
  },
  {
    icon: "studio",
    title: "스튜디오 촬영 이미지 생성",
    comment:
      "패션, 화장품, 가구, 가전 등 제품군에 최적화된 고품질 촬영 연출 이미지 생성",
  },
  {
    icon: "translate",
    title: "다국어 변환 이미지 생성",
    comment: "하나의 콘텐츠를 문맥에 맞는 여러 언어로 이미지를 자동 변환",
  },
  {
    icon: "infographic",
    title: "인포그래픽 이미지 생성",
    comment:
      "제품 설명, 홍보물, 분석 리포트 등 중요 정보를 시각화한 이미지 생성",
  },
  {
    icon: "news",
    title: "삽화 이미지 생성",
    comment:
      "뉴스, 웹소설 등 텍스트 기반 콘텐츠의 주제와 문맥을 시각화한 대표 이미지 생성",
  },
  {
    icon: "illustration",
    title: "일러스트 이미지 완성",
    comment:
      "의뢰 디자인, 웹툰(콘텐츠) 스케치 등의 이미지를 기반으로 채색·완성된 일러스트로 변환",
  },
];

export const Content: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-[40px]">
      <div className="flex flex-col gap-[24px] items-center justify-center">
        <div className="flex flex-col gap-[14px] items-center justify-center">
          <span className="text-[#0F172B] text-[64px] font-medium leading-[85.12px]">
            <span className="text-[#155DFC] font-bold">#USER_ID</span>님
            안녕하세요
          </span>
          <span className="text-[#0F172B] text-[36px] font-bold leading-[47.88px]">
            무엇을 도와드릴까요?
          </span>
        </div>
        <button
          onClick={() => navigate("/editor")}
          className="bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] p-[14px_24px] rounded-[8px] flex items-center gap-[4px] text-[#F8FAFC] text-[17px] font-bold leading-[29.88px] w-fit"
        >
          <span>+</span>
          <span>Create Now</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-[24px]">
        {list.map((el) => (
          <Template key={el.icon} template={el} />
        ))}
        <div className="flex items-center justify-center w-[168px] h-[190px]">
          <button
            onClick={() => navigate("/template")}
            className="flex items-center justify-center w-[80px] h-[80px] bg-[#155DFC] rounded-full text-white"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
