import type React from 'react';
import { useEffect, useState } from 'react';
import CloseIcon from '@/assets/close-line.svg';
import type { DAMFile } from './DAMData';
import {
  listAssetPermissions,
  saveAssetPermissions,
  type AssetPermission,
} from '@/features/dam/api';

interface Props {
  file: DAMFile;
  onClose: () => void;
}

interface UserPermission {
  id: string;
  name: string;
  email: string;
  accessLevel: 'owner' | 'change-permissions' | 'can-edit' | 'can-view';
}

const ACCESS_LEVELS = [
  { label: 'Owner', value: 'owner' },
  { label: 'Change permissions', value: 'change-permissions' },
  { label: 'Can edit', value: 'can-edit' },
  { label: 'Can view', value: 'can-view' },
] as const;

export const PermissionModal: React.FC<Props> = ({ file, onClose }: Props) => {
  const [emailInput, setEmailInput] = useState('');
  const [selectedLevel, setSelectedLevel] =
    useState<UserPermission['accessLevel']>('can-view');
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listAssetPermissions(file.id)
      .then((rows) => {
        setPermissions(
          rows.map((row) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            accessLevel: row.access_level,
          })),
        );
      })
      .catch(() => {
        setPermissions([
          {
            id: 'owner',
            name: 'Admin',
            email: 'admin@itcen.com',
            accessLevel: 'owner',
          },
        ]);
      });
  }, [file.id]);

  const handleAddUser = () => {
    if (!emailInput.trim()) return;
    const newUser: UserPermission = {
      id: Date.now().toString(),
      name: emailInput.split('@')[0],
      email: emailInput,
      accessLevel: selectedLevel,
    };
    setPermissions((prev) => [newUser, ...prev]);
    setEmailInput('');
  };

  const handleRemoveUser = (id: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLevelChange = (id: string, level: string) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, accessLevel: level as UserPermission['accessLevel'] }
          : p,
      ),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: AssetPermission[] = permissions.map((permission) => ({
        id: permission.id,
        name: permission.name,
        email: permission.email,
        access_level: permission.accessLevel,
      }));
      await saveAssetPermissions(file.id, payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-[600px] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in duration-150">
        <div className="flex items-center justify-between p-[20px_24px] border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <h2 className="text-[16px] font-bold text-[#0F172B]">
              Manage Permissions
            </h2>
            <p className="text-[12px] text-[#94A3B8] truncate max-w-[400px]">
              /DAM/{file.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-[4px] hover:bg-[#E2E8F0] rounded-full transition-colors"
          >
            <img src={CloseIcon} className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-[24px] border-b border-[#F1F5F9] bg-white flex items-center gap-[12px]">
            <div className="flex-1 flex items-center gap-[8px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] px-[12px] py-[10px] focus-within:border-[#155DFC] transition-all">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="17" y1="11" x2="23" y2="11" />
              </svg>
              <input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="사용자 이메일 입력"
                className="flex-1 bg-transparent text-[14px] outline-none"
              />
            </div>
            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(
                  e.target.value as UserPermission['accessLevel'],
                )
              }
              className="px-[12px] py-[10px] bg-white border border-[#E2E8F0] rounded-[8px] text-[13px] text-[#475569] outline-none hover:border-[#CBD5E1] transition-all"
            >
              {ACCESS_LEVELS.map((level) => (
                <option key={level.label} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddUser}
              className="px-[16px] py-[10px] bg-[#155DFC] text-white text-[13px] font-bold rounded-[8px] hover:bg-[#155DFC]/90 transition-all active:scale-[0.98]"
            >
              Add
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-[20px_24px]">
            <div className="flex flex-col gap-[16px]">
              {permissions.map((permission) => (
                <div
                  key={permission.id}
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#EFF6FF] text-[#155DFC] flex items-center justify-center font-bold text-[13px]">
                      {permission.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#0F172B]">
                        {permission.name}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        {permission.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-[12px]">
                    {permission.accessLevel === 'owner' ? (
                      <span className="text-[12px] text-[#94A3B8] font-medium px-[8px]">
                        Owner
                      </span>
                    ) : (
                      <div className="flex items-center gap-[8px]">
                        <select
                          value={permission.accessLevel}
                          onChange={(e) =>
                            handleLevelChange(permission.id, e.target.value)
                          }
                          className="bg-transparent text-[12px] text-[#475569] outline-none border-none hover:text-[#155DFC] transition-all text-right"
                        >
                          {ACCESS_LEVELS.filter(
                            (level) => level.value !== 'owner',
                          ).map((level) => (
                            <option key={level.label} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveUser(permission.id)}
                          className="p-[4px] opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-full transition-all"
                          title="삭제"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#DC2626"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-[20px_24px] border-t border-[#E2E8F0] flex justify-end bg-[#F8FAFC]">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-[32px] py-[10px] text-white text-[14px] font-bold rounded-[8px] shadow-md transition-all active:scale-[0.98] ${
              saving
                ? 'bg-[#94A3B8] cursor-not-allowed'
                : 'bg-[#155DFC] hover:bg-[#155DFC]/90'
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
