import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ActionButton from "./ActionButton";

type ProfileSectionProps = {
  username: string;
  displayName: string;
  userAvatar: string;
  tags: { imageSrc: string; label: string }[];
  followingCount: string;
  followerCount: string;
  isEditable?: boolean;
  onProfileUpdate?: (data: {
    nickname: string;
    profileImage?: File;
  }) => Promise<void>;
};

function ProfileSection({
  username,
  displayName,
  userAvatar,
  tags,
  followingCount,
  followerCount,
  isEditable = false,
  onProfileUpdate,
}: ProfileSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState(displayName);
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB 제한
        setError("이미지 크기는 5MB를 초과할 수 없습니다.");
        return;
      }
      setNewProfileImage(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!onProfileUpdate) return;

    try {
      setIsUpdating(true);
      setError(null);

      const updateData = {
        nickname: newNickname,
        ...(newProfileImage && { profileImage: newProfileImage }),
      };

      await onProfileUpdate(updateData);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "프로필 업데이트 중 오류가 발생했습니다."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex overflow-hidden flex-col w-full max-md:max-w-full">
      <div className="overflow-hidden self-stretch px-5 pt-8 w-full text-3xl font-bold text-black max-md:max-w-full">
        내 프로필
        {isEditable && (
          <button
            className="ml-4 px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
            onClick={() => setIsEditModalOpen(true)}
          >
            프로필 수정
          </button>
        )}
      </div>

      <div className="flex overflow-hidden relative gap-2.5 items-start px-2.5 mt-2.5 max-w-full w-[1566px]">
        <div className="flex overflow-hidden z-0 flex-col py-8 pl-px my-auto min-w-[240px]">
          <ProfileHeader
            username={username}
            displayName={displayName}
            userAvatar={userAvatar}
            tags={tags}
          />
          <div className="flex mt-2.5 min-h-[11px] w-[13px]" />
        </div>

        <div className="flex overflow-hidden absolute z-0 flex-col items-center self-start py-8 whitespace-nowrap h-[174px] left-[332px] min-h-[174px] top-[9px] w-[210px]">
          <ProfileStats
            followingCount={followingCount}
            followerCount={followerCount}
          />
          <div className="flex gap-9 items-start mt-1 text-xs font-bold text-center text-white">
            <ActionButton
              label="채팅하기"
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/6ae03550e188e9ec3bd261efe3de0597091556b30fd904fc17ffab674b0eeebc"
            />
            <ActionButton
              label="통화하기"
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/399ab66881a5b3d65c810cdd774a95603999fbd9483f638f3fd03daf4b38912f"
            />
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">프로필 수정</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nickname" className="block text-sm font-medium">
                  닉네임
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={newNickname}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewNickname(e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-medium"
                >
                  프로필 이미지
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>

              {error && <div className="text-sm text-red-500">{error}</div>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm bg-violet-700 text-white rounded-md hover:bg-violet-800 disabled:bg-violet-300"
                >
                  {isUpdating ? "업데이트 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileSection;
