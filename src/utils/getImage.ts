import PenSize_2 from "./../assets/pen_size_2.svg";
import PenSize_3 from "./../assets/pen_size_3.svg";
import PenSize_4 from "./../assets/pen_size_4.svg";
import PenSize_5 from "./../assets/pen_size_5.svg";
import Red from "./../assets/color_red.svg";
import Blue from "./../assets/color_blue.svg";
import Yellow from "./../assets/color_yellow.svg";
import Empty from "./../assets/color_empty.svg";
/** 이미지 리턴 유틸 함수 */

export const getPenStrokeWidthImg = (value: number) => {
  switch (value) {
    case 2:
      return PenSize_2;
    case 3:
      return PenSize_3;
    case 5:
      return PenSize_4;
    case 6:
      return PenSize_5;
  }
};

export const getPenColorImg = (value: string) => {
  switch (value) {
    case "#E7000B":
      return Red;
    case "#155DFC":
      return Blue;
    case "#FFD230":
      return Yellow;
    case "empty":
      return Empty;
  }
};
