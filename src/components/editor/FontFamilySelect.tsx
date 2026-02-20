import type React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { TextObject } from "./EditorCanvas";
import { loadGoogleFont } from "../../utils/fontLoader";

interface FontFamilySelectProps {
  selectedTextObject?: TextObject;
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void;
}

const googleFonts = [
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Oswald",
  "Source Sans Pro",
  "Raleway",
  "PT Sans",
  "Merriweather",
  "Noto Sans KR",
];

export const FontFamilySelect: React.FC<FontFamilySelectProps> = ({
  selectedTextObject,
  handleUpdateTextObject,
}) => {
  const handleFontChange = (fontFamily: string) => {
    if (!selectedTextObject) return;

    // Load the font from Google Fonts
    loadGoogleFont(fontFamily);

    // Update the text object's state
    handleUpdateTextObject(selectedTextObject.id, { fontFamily });
  };

  return (
    <Select
      value={selectedTextObject?.fontFamily || "Noto Sans KR"}
      onValueChange={handleFontChange}
    >
      <SelectTrigger className="border border-[#90A1B9] rounded-[6px] w-full focus:outline-0 p-[14px] h-[52px]">
        <SelectValue placeholder="글씨체 선택" />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectGroup>
          {googleFonts.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
