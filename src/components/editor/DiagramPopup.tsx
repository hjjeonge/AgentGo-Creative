import type React from "react";
import Square from "./../../assets/square.svg";
import RoundSquare from "./../../assets/round_square.svg";
import Oblong from "./../../assets/oblong.svg";
import RoundOblong from "./../../assets/round_oblong.svg";
import Triangle from "./../../assets/triangle.svg";
import Rhombus from "./../../assets/rhombus.svg";
import Pentagon from "./../../assets/pentagon.svg";
import Hexagon from "./../../assets/hexagon.svg";
import Circle from "./../../assets/circle.svg";
import Oval from "./../../assets/oval.svg";
import CircleCut from "./../../assets/circle_cut.svg";
import Semicircle from "./../../assets/semicircle.svg";
import Arrow from "./../../assets/arrow.svg";
import ArrowFill from "./../../assets/arrow_fill.svg";
import LabelCut from "./../../assets/label_cut.svg";
import Label from "./../../assets/label.svg";

const diagramList = [
  { name: "square", img: Square },
  { name: "round_square", img: RoundSquare },
  { name: "oblong", img: Oblong },
  { name: "round_oblong", img: RoundOblong },
  { name: "triangle", img: Triangle },
  { name: "rhombus", img: Rhombus }, // 마름로
  { name: "pentagon", img: Pentagon }, // 오각형
  { name: "hexagon", img: Hexagon }, // 육각형
  { name: "circle", img: Circle },
  { name: "oval", img: Oval }, // 타원형
  { name: "circle_cut", img: CircleCut },
  { name: "semicircle", img: Semicircle },
  { name: "arrow", img: Arrow },
  { name: "arrow_fill", img: ArrowFill },
  { name: "label_cut", img: LabelCut },
  { name: "label", img: Label },
];

interface Props {
  shapeType: string;
  setShapeType: (value: string) => void;
}

export const DiagramPopup: React.FC<Props> = ({
  shapeType,
  setShapeType,
}: Props) => {
  return (
    <div className="absolute z-[50] top-[140px] right-[290px] rounded-[6px] bg-[#F1F5F9] border border-[#90A1B9] p-[24px] grid grid-cols-4">
      {diagramList.map((el) => (
        <button
          key={el.name}
          className={`w-[55px] h-[55px] p-[10px] flex items-center justify-center rounded-[6px] ${shapeType === el.name && "bg-[#CAD5E2]"}`}
          onClick={() => setShapeType(el.name)}
        >
          <img src={el.img} />
        </button>
      ))}
    </div>
  );
};
