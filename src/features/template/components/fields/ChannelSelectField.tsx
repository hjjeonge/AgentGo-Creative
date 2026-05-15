import type React from 'react';

import {
  CHANNEL_POLICIES,
  CHANNELS,
  FUNNEL_META,
  type ChannelId,
  type FunnelGroup,
} from '@/features/template/constants/channelOptions';
import type { TemplateField } from '@/features/template/types';

import { FormRow } from '../FormRow';

interface ChannelSelectFieldProps {
  field: TemplateField;
  selectedChannels: string[];
  onAddTag: (id: string) => void;
  onRemoveTag: (id: string) => void;
}

const FUNNEL_NUM_STYLE: Record<FunnelGroup, string> = {
  awareness: 'bg-[#EFF6FF] text-[#155DFC]',
  trust: 'bg-[#F0FDF4] text-[#16A34A]',
  convert: 'bg-[#FFF7ED] text-[#EA580C]',
};

export const ChannelSelectField: React.FC<ChannelSelectFieldProps> = ({
  field,
  selectedChannels,
  onAddTag,
  onRemoveTag,
}) => {
  const handleToggle = (id: ChannelId) => {
    if (selectedChannels.includes(id)) {
      onRemoveTag(id);
    } else {
      onAddTag(id);
    }
  };

  return (
    <FormRow label={field.label} required={field.required}>
      <div className="flex flex-col gap-2">
        {(['awareness', 'trust', 'convert'] as FunnelGroup[]).map((groupId) => {
          const meta = FUNNEL_META[groupId];
          const numStyle = FUNNEL_NUM_STYLE[groupId];
          const groupChannels = CHANNELS.filter((c) => c.group === groupId);
          const selectedCount = groupChannels.filter((c) =>
            selectedChannels.includes(c.id),
          ).length;

          return (
            <div
              key={groupId}
              className="border border-border-neutral rounded-sm overflow-hidden"
            >
              {/* Group header */}
              <div className="px-4 py-2 flex items-center gap-2 border-b border-border-neutral bg-white">
                <span
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ${numStyle}`}
                >
                  {meta.num}
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {meta.title}
                </span>
                <span className="ml-auto text-xs text-text-tertiary">
                  {selectedCount} / {groupChannels.length} 선택
                </span>
              </div>

              {/* Channel cards */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-white sm:grid-cols-3 lg:grid-cols-4">
                {groupChannels.map((ch) => {
                  const active = selectedChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleToggle(ch.id as ChannelId)}
                      className={`flex flex-col gap-1.5 p-3 rounded-xs border text-left transition-colors ${
                        active
                          ? 'border-[#155DFC] bg-[#EFF6FF]'
                          : 'border-border-neutral bg-white hover:border-[#155DFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{ch.icon}</span>
                          <span
                            className={`text-xs font-semibold leading-tight ${
                              active ? 'text-[#155DFC]' : 'text-text-primary'
                            }`}
                          >
                            {ch.label}
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                            active
                              ? 'bg-[#155DFC] border-[#155DFC]'
                              : 'border-border-neutral'
                          }`}
                        >
                          {active && (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 8 8"
                              fill="none"
                            >
                              <path
                                d="M1.5 4L3.5 6L6.5 2"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-text-tertiary leading-tight">
                        {ch.desc}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-[#F1F5F9] text-[#62748E]">
                          {ch.role}
                        </span>
                        <span className="text-[10px] text-text-tertiary">
                          {ch.size}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Conversion policy table */}
        {selectedChannels.length > 0 && (
          <div className="border border-border-neutral rounded-sm overflow-hidden mt-1">
            <div className="px-4 py-2 border-b border-border-neutral flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">
                채널 변환 정책
              </span>
              <span className="text-xs text-text-tertiary">
                선택한 채널의 포맷 · 톤 · 운영 규칙
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="bg-[#F8FAFC] text-text-tertiary text-[11px] border-b border-border-neutral">
                    <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                      채널
                    </th>
                    <th className="text-right px-3 py-2 font-medium whitespace-nowrap">
                      최대 길이
                    </th>
                    <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                      포맷
                    </th>
                    <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                      톤 변환
                    </th>
                    <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                      운영 규칙
                    </th>
                    <th className="text-left px-3 py-2 font-medium whitespace-nowrap">
                      컴플라이언스
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-neutral">
                  {selectedChannels.map((id) => {
                    const ch = CHANNELS.find((c) => c.id === id);
                    if (!ch) return null;
                    const policy = CHANNEL_POLICIES[id as ChannelId];
                    if (!policy) return null;
                    return (
                      <tr key={id}>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span>{ch.icon}</span>
                            <span className="font-medium text-text-primary whitespace-nowrap">
                              {ch.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-[#155DFC] whitespace-nowrap">
                          {policy.maxChars}자
                        </td>
                        <td className="px-3 py-2 text-text-tertiary">
                          {policy.format}
                        </td>
                        <td className="px-3 py-2 text-text-tertiary whitespace-nowrap">
                          {policy.toneShift}
                        </td>
                        <td className="px-3 py-2 text-text-tertiary">
                          {policy.rules}
                        </td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono border border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C] whitespace-nowrap">
                            {policy.compliance}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </FormRow>
  );
};
