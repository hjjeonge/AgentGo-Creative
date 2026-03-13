import { TEMPLATE_CONFIGS } from '@/features/template/constants/templateConfig';
import type { TemplateConfig } from '@/features/template/types';

export function getTemplateConfig(templateKey: string | null): TemplateConfig {
  return (
    TEMPLATE_CONFIGS.find((item) => item.key === templateKey) ??
    TEMPLATE_CONFIGS[0]
  );
}
