import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { useLoginMutation } from '../queries/auth/useLoginMutation';
import { setTokens } from '../utils/tokenManager';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await mutateAsync({ email, password });
      const { access_token, refresh_token } = res;
      setTokens(access_token, refresh_token);
      navigate('/');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '이메일 또는 비밀번호가 올바르지 않습니다.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F5F9]">
      <div className="w-[400px] bg-white rounded-[16px] shadow-sm border border-[#E2E8F0] p-[40px]">
        {/* 로고 */}
        <div className="flex justify-center mb-[32px]">
          <img src={Logo} alt="AgentGo Creative" className="h-[32px]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          {/* 이메일 */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#475569] font-medium">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요."
              className="border border-[#CBD5E1] rounded-[8px] px-[14px] py-[10px] text-[14px] text-[#0F172B] placeholder:text-[#94A3B8] outline-none focus:border-[#155DFC]"
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[13px] text-[#475569] font-medium">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요."
              className="border border-[#CBD5E1] rounded-[8px] px-[14px] py-[10px] text-[14px] text-[#0F172B] placeholder:text-[#94A3B8] outline-none focus:border-[#155DFC]"
            />
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-[13px] text-[#E11D48]">{error}</p>}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-[8px] w-full bg-[linear-gradient(135deg,#0055E9_0%,#6A14D9_100%)] text-white py-[12px] rounded-[8px] text-[15px] font-bold disabled:opacity-60"
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};
