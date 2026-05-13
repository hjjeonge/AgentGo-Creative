export interface ImageGenerationHistoryItem {
  id: string; // 작업물 ID
  title: string; // 작업물 제목
  thumbnailUrl: string; // 대표/마지막 작업 이미지 URL
  templateName: string; // 사용한 템플릿명
  createdAt: string; // 생성 일시
  updatedAt: string; // 마지막 수정 일시
  lastModifiedBy: string; // 마지막 수정자
  createdBy?: string; // 생성자
}
