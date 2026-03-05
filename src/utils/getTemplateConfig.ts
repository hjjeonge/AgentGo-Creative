import { TEMPLATE_CONFIGS } from '../constants/templateConfigs';
import type { TemplateConfig } from '../types/template';

export function getTemplateConfig(templateKey: string | null): TemplateConfig {
  return (
    TEMPLATE_CONFIGS.find((item) => item.key === templateKey) ??
    TEMPLATE_CONFIGS[0]
  );
}
