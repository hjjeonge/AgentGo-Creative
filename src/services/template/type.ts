export interface FavoriteTemplateRes {
  id: string;
  imgUrl: string;
  title: string;
  summary: string;
}

export interface TemplateRes {
  id: string;
  imgUrl: string;
  title: string;
  summary: string;
  isLike: boolean; // 즐겨찾기 추가 여부
}

export interface CreateNewTemplateReq {
  imgUrl: string;
  title: string;
  summary: string;
  fields: Record<string, string>;
}
