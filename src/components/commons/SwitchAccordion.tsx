import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { CustomSwitch } from "./CustomSwitch";
import Arrow from "./../../assets/arrow_down.svg";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface Props {
  value: string;
  title: string;
  isShow: boolean;
  isSwitchOn?: boolean;
  handleSwitch?: (value: boolean) => void;
  isOpen?: boolean;
  handleOpen?: (value: boolean) => void;
  children?: React.ReactNode;
}

export const SwitchAccordion: React.FC<Props> = ({
  value,
  title,
  isShow,
  isSwitchOn,
  isOpen,
  children,
}: Props) => {
  console.log(title, " : ", isShow);
  const [openValue, setOpenValue] = useState<string | undefined>();
  return (
    <Accordion
      type="single"
      collapsible
      value={openValue}
      onValueChange={setOpenValue}
    >
      <AccordionItem value={value}>
        <AccordionTrigger asChild>
          <div className="flex items-center justify-between p-[7px] w-full">
            <div className="flex items-center justify-center gap-[4px]  text-[16px] leading-[24px] text-[#0F172B]">
              {isShow && (
                <button className="flex items-center justify-center">
                  <img
                    src={Arrow}
                    className={cn(
                      `ransition-transform duration-200 ${openValue === value ? "rotate-0" : "-rotate-90"}`,
                    )}
                  />
                </button>
              )}
              <span>{title}</span>
            </div>
            <CustomSwitch />
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
