import { useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';

import { TOOLBAR_POPUP_TOOLS } from '@/features/editor/constants/toolbar';

export const useToolbarPopup = (
  toolbarRef: RefObject<HTMLDivElement | null>,
) => {
  const [isToolPopupOpen, setIsToolPopupOpen] = useState(false);
  const [colorPopupMode, setColorPopupMode] = useState<
    'picker' | 'palette' | null
  >(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target;
      const isInsideToolbar = toolbarRef.current?.contains(target as Node);
      const isInsidePortalPopup =
        target instanceof Element &&
        !!target.closest(
          '[data-slot="popover-content"], [data-slot="select-content"]',
        );

      if (isInsideToolbar || isInsidePortalPopup) return;

      setIsToolPopupOpen(false);
      setColorPopupMode(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toolbarRef]);

  const syncPopupState = (activeTool: string) => {
    const hasToolPopup = TOOLBAR_POPUP_TOOLS.includes(
      activeTool as (typeof TOOLBAR_POPUP_TOOLS)[number],
    );

    setIsToolPopupOpen(hasToolPopup);
    if (activeTool !== 'pen') {
      setColorPopupMode(null);
    }
  };

  const hasPopup = useMemo(
    () => (tool: string) =>
      TOOLBAR_POPUP_TOOLS.includes(
        tool as (typeof TOOLBAR_POPUP_TOOLS)[number],
      ),
    [],
  );

  return {
    colorPopupMode,
    hasPopup,
    isToolPopupOpen,
    setColorPopupMode,
    setIsToolPopupOpen,
    syncPopupState,
  };
};
