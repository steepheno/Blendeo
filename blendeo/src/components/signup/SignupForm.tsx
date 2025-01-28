import { useState } from "react";
import axios from 'axios';

import InputField from "../login/LoginInput";
import VerificationInput from "./VerificationInput";

const API_URL = "http://i12a602.p.ssafy.io:8080/api/v1";

const SignupForm = () => {
  // 폼 상태 관리
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 상태 메시지
  const [emailSent, setEmailSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");

  // 이메일 인증번호 전송
  const handleEmailVerification = async () => {
    console.log("이메일 인증 시도: ", email);
    try {
      const response = await axios.post(`${API_URL}/user/mail/check`, {
        email: email
      });
      console.log("이메일 인증 응답: ", response);

      if (response.status === 200) {
        setEmailSent(true);
        alert("인증번호가 전송되었습니다.");
      }
    } catch (error) {
      console.error("이메일 전송 실패: ", error);
      alert('인증번호 전송에 실패했습니다.');
    }
  };

  // 인증번호 확인
  const handleCodeVerification = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/mail/check`, {
        email: email,
        code: verificationCode
      });

      if (response.status === 200) {
        setVerificationStatus('success');
        alert('이메일 인증이 완료되었습니다.')
      }
    } catch (error) {
      console.error('인증번호 확인 실패: ', error);
      setVerificationStatus('fail');
      alert('잘못된 인증번호입니다.');
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationStatus !== 'success') {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      const response = await axios.post(`${API_URL}/user/auth/signup`, {
        email,
        password,
      });
  
      if (response.status === 200) {
        alert('회원가입이 완료되었습니다.');
      }
    } catch (error) {
      console.error('회원가입 실패: ', error);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <VerificationInput
        type="email"
        placeholder="ssafy@gmail.com"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[374px] max-md:w-full"
        id="email"
        aria-label="Email address"
        value={email}  // 이메일 상태값
        onChange={(e) => setEmail(e.target.value)}  // 이메일 변경 핸들러
        onVerify={handleEmailVerification}
        buttonText="인증번호 전송"
      />

      <VerificationInput
        type="text"
        placeholder="568349"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="verification"
        aria-label="Verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        onVerify={handleCodeVerification}
        buttonText="확인"
        disabled={!emailSent}
      />

      <InputField
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] max-md:w-full"
        id="password"
        aria-label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
        비밀번호는 영문자(대,소문자), 숫자, 특수문자를 포함하여 최소 8자 이상 작성 해야 합니다.
      </div>

      <InputField
        type="password"
        placeholder="••••••••"
        className="px-4 py-0 text-base rounded-md border border-gray-200 border-solid h-[72px] w-[533px] max-md:w-full"
        id="confirmPassword"
        aria-label="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <div className="mt-1.5 mb-1.5 text-xs font-light leading-5 text-zinc-400">
        {password && confirmPassword && (password === confirmPassword ?
          '비밀번호가 일치합니다.' :
          '비밀번호가 일치하지 않습니다.'
        )}
      </div>

      <button
        type="submit"
        className="gap-3 w-full px-6 py-5 mt-9 text-xl font-semibold tracking-wide leading-none text-center text-white bg-violet-700 rounded-md"
        disabled={verificationStatus !== 'success'}
      >
        회원가입하기
      </button>
    </form>
  );
};

export default SignupForm;