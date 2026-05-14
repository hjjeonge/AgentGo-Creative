import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent p-1 shadow-xs transition-colors outline-none focus-visible:border-focus-visible focus-visible:ring-[3px] focus-visible:ring-focus-visible/50 disabled:cursor-not-allowed data-[state=checked]:bg-[#1447E6] hover:data-[state=checked]:bg-[#193CB8] data-[state=unchecked]:bg-[#45556C] hover:data-[state=unchecked]:bg-[#45556C] disabled:bg-[#E2E8F0] disabled:data-[state=checked]:bg-[#E2E8F0] disabled:data-[state=unchecked]:bg-[#E2E8F0] data-[size=default]:h-5 data-[size=default]:w-8 data-[size=sm]:h-5 data-[size=sm]:w-8',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-3 rounded-full bg-white ring-0 transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0 group-data-[disabled]/switch:bg-[#62748E]',
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
