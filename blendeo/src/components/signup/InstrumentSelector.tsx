import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';
import { Instrument, InstrumentCategory } from '@/types/api/auth'
import { signup } from '@/api/auth';
import { modifyUserInst } from '@/api/user';
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const InstrumentSelector = () => {
  const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);
  const [initialInstruments, setInitialInstruments] = useState<Instrument[]>([]);
  const [, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state;
  const mode = location.state?.mode || 'signup';

  const instrumentsWithIds: InstrumentCategory = {
    "현악기": [
    { instrument_id: 1, instrument_name: "일렉트릭 기타" },
    { instrument_id: 2, instrument_name: "어쿠스틱 기타" },
    { instrument_id: 3, instrument_name: "클래식 기타" },
    { instrument_id: 4, instrument_name: "베이스 기타" },
    { instrument_id: 5, instrument_name: "바이올린" },
    { instrument_id: 6, instrument_name: "첼로" },
  ],
  "건반악기": [
    { instrument_id: 9, instrument_name: "피아노" },
    { instrument_id: 8, instrument_name: "신디사이저" },
    { instrument_id: 19, instrument_name: "멜로디언" },
  ],
  "타악기": [
    { instrument_id: 7, instrument_name: "드럼" },
    { instrument_id: 12, instrument_name: "카혼" },
    { instrument_id: 14, instrument_name: "탬버린" },
    { instrument_id: 15, instrument_name: "셰이커" },
    { instrument_id: 21, instrument_name: "실로폰" },
    { instrument_id: 20, instrument_name: "캐스터넷츠" },
    { instrument_id: 13, instrument_name: "핸드 드럼" },
  ],
  "목관악기": [
    { instrument_id: 10, instrument_name: "색소폰" },
  ],
  "전자음향": [
    { instrument_id: 11, instrument_name: "MIDI 컨트롤러" },
    { instrument_id: 30, instrument_name: "글리치 사운드" },
    { instrument_id: 29, instrument_name: "노이즈" },
    { instrument_id: 24, instrument_name: "오토튠" },
    { instrument_id: 23, instrument_name: "보코더" },
    { instrument_id: 26, instrument_name: "필드 레코딩" },
    { instrument_id: 27, instrument_name: "샘플" },
    { instrument_id: 28, instrument_name: "패드" },
  ],
  "바디 퍼커션": [
    { instrument_id: 16, instrument_name: "클랩" },
    { instrument_id: 17, instrument_name: "발구르기" },
    { instrument_id: 22, instrument_name: "비트박스" },
    { instrument_id: 18, instrument_name: "보컬" },
    { instrument_id: 25, instrument_name: "보컬 이펙트" },
  ],
  "보컬": [
  ]
  };

  const handleSelect = (instrument: Instrument) => {
    if (selectedInstruments.some(selected => selected.instrument_id === instrument.instrument_id)) {
      // 이미 선택된 악기라면 제거
      setSelectedInstruments(selectedInstruments.filter(
        selected => selected.instrument_id !== instrument.instrument_id
      ));
    } else {
      // 새로운 악기 선택 (3개 제한)
      if (selectedInstruments.length < 3) {
        setSelectedInstruments([...selectedInstruments, instrument]);
      }
    }
  };

  // 초기 악기 정보 설정
  useEffect(() => {
    if (mode === 'modify' && location.state?.instruments) {
      setInitialInstruments(location.state.instruments);
      setSelectedInstruments(location.state.instruments);
    }
  }, [mode, location.state]);

  // 회원가입 모드 or 마이페이지 수정모드 분기 처리
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const selectedInstrumentIds = selectedInstruments.map(
        instrument => instrument.instrument_id
      );

      if (selectedInstrumentIds.length === 0) {
        setError("연주 가능한 악기를 선택해주세요");
        return;
      }

      // 회원가입 모드
      if (mode === 'signup') {
        const signupData = {
          ...formData,
          instrumentIds: selectedInstrumentIds
        };
        
        await signup(signupData);

        toast.success("회원가입이 완료되었습니다. 로그인해주세요.")
        navigate("/auth/signin", {
          state: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
        });
      } else {
        // 악기 정보 수정 모드
        const newInstrumentIds = selectedInstruments.map(
          instrument => instrument.instrument_id
        ).filter(id =>
          !initialInstruments.some(initial => initial.instrument_id === id)
        )
        await modifyUserInst(newInstrumentIds);
        toast.success("악기 정보가 수정되었습니다.");
        navigate("/profile/me", {
          state: { message: "악기 정보가 성공적으로 수정되었습니다." }
        });
      }
    } catch (err) {
      console.error(`${mode === 'signup' ? '회원가입' : '악기 정보 수정'} 실패:`, err);
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
        error.message ||
        `${mode === 'signup' ? '회원가입' : '악기 정보 수정'}에 실패했습니다.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Music className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">연주하는 악기 선택</h2>
      </div>
      
      <p className="mb-4 text-gray-600">
        주로 연주하는 악기를 최대 3개까지 선택해주세요
      </p>

      <div className="space-y-6">
        {Object.entries(instrumentsWithIds).map(([category, instrumentList]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {instrumentList.map((instrument) => (
                <button
                  key={instrument.instrument_id}
                  onClick={() => handleSelect(instrument)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedInstruments.some(selected => selected.instrument_id === instrument.instrument_id)
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    ${selectedInstruments.length >= 3 && !selectedInstruments.some(selected => selected.instrument_id === instrument.instrument_id)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                    }`}
                  disabled={selectedInstruments.length >= 3 && !selectedInstruments.some(selected => selected.instrument_id === instrument.instrument_id)}
                >
                  {instrument.instrument_name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">선택된 악기</h4>
        <div className="flex flex-wrap gap-2">
          {selectedInstruments.length > 0 ? (
            selectedInstruments.map((instrument) => (
              <span
                key={instrument.instrument_id}
                className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm"
              >
                {instrument.instrument_name}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">아직 선택된 악기가 없습니다</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="gap-3 w-full px-6 py-5 mt-9 text-xl font-semibold tracking-wide leading-none text-center text-white bg-violet-700 rounded-md hover:bg-violet-800 disabled:opacity-50"
      >
        {isLoading
          ? (mode === 'signup' ? "가입 중..." : "수정 중...")
          : (mode === 'signup' ? "회원가입하기" : "수정하기")}
      </button>
    </div>
  );
};

export default InstrumentSelector;