import type React from 'react';

import { loadGoogleFont } from '@/commons/utils/fontLoader';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DEFAULT_EDITOR_FONT,
  EDITOR_GOOGLE_FONTS,
} from '@/features/editor/constants/fonts';
import type { TextObject } from '@/features/editor/types';

interface FontFamilySelectProps {
  selectedTextObject?: TextObject;
  handleUpdateTextObject: (id: string, updates: Partial<TextObject>) => void;
}

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
      value={selectedTextObject?.fontFamily || DEFAULT_EDITOR_FONT}
      onValueChange={handleFontChange}
    >
      <SelectTrigger className="border border-[#90A1B9] rounded-[6px] w-full focus:outline-0 p-[14px] h-[52px]">
        <SelectValue placeholder="글씨체 선택" />
      </SelectTrigger>
      <SelectContent position="popper" className="z-[200] bg-white">
        <SelectGroup>
          {EDITOR_GOOGLE_FONTS.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
