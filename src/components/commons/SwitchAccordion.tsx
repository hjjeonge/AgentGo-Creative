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
  contentClassName?: string;
  children?: React.ReactNode;
}

export const SwitchAccordion: React.FC<Props> = ({
  value,
  title,
  isShow,
  isSwitchOn,
  handleSwitch,
  isOpen,
  handleOpen,
  children,
  contentClassName,
}: Props) => {
  const [openValue, setOpenValue] = useState<string | undefined>();
  const resolvedOpenValue =
    isOpen !== undefined ? (isOpen ? value : undefined) : openValue;
  return (
    <Accordion
      type="single"
      collapsible
      value={resolvedOpenValue}
      onValueChange={(nextValue) => {
        setOpenValue(nextValue);
        handleOpen?.(nextValue === value);
      }}
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
                      `transition-transform duration-200 ${resolvedOpenValue === value ? "rotate-0" : "-rotate-90"}`,
                    )}
                  />
                </button>
              )}
              <span>{title}</span>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <CustomSwitch
                checked={isSwitchOn}
                onCheckedChange={(checked) => {
                  handleSwitch?.(checked);
                  if (checked) {
                    handleOpen?.(true);
                    setOpenValue(value);
                  }
                }}
              />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className={contentClassName}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
