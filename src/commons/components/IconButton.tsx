import {
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { buttonVariantStyles } from '@/commons/constants/button';
import type { ButtonVariant } from '@/commons/types/button';
import { getInteractionState } from '@/commons/utils/button';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  selected?: boolean;
  disabledButClickable?: boolean;
  onDisabledClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const IconButton = ({
  children,
  className,
  disabledButClickable = false,
  disabled = false,
  onBlur,
  onClick,
  onDisabledClick,
  onFocus,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  selected = false,
  style,
  type = 'button',
  variant = 'primary-solid',
  ...props
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const visualDisabled = disabled || disabledButClickable;
  const nativeDisabled = disabled && !disabledButClickable;
  const state = getInteractionState(visualDisabled, hovered, pressed, selected);
  const variantStyle = buttonVariantStyles[variant][state];
  const composedStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    fontSize: '14px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    transition:
      'background-color 160ms ease, border-color 160ms ease, color 160ms ease',
    cursor: visualDisabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    borderRadius: '5px',
    padding: '7px',
    width: '32px',
    height: '32px',
    ...variantStyle,
    ...style,
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabledButClickable) {
      event.preventDefault();
      onDisabledClick?.();
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      className={className}
      disabled={nativeDisabled}
      onBlur={(event) => {
        setPressed(false);
        onBlur?.(event);
      }}
      onClick={handleClick}
      onFocus={(event) => {
        onFocus?.(event);
      }}
      onMouseDown={(event) => {
        setPressed(true);
        onMouseDown?.(event);
      }}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        setPressed(false);
        onMouseLeave?.(event);
      }}
      onMouseUp={(event) => {
        setPressed(false);
        onMouseUp?.(event);
      }}
      style={composedStyle}
      type={type}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
};
