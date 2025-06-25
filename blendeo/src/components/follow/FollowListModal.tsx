// components/user/FollowListModal.tsx
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import noUserImg from "@/assets/no_user.jpg";

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "following" | "followers" | null;
  followData: {
    isFollowing: boolean;
    followerCount: number;
    followingCount: number;
    loading: boolean;
    followingIdList: number[];
    followingNicknameList: string[];
    followerIdList: number[];
    followerNicknameList: string[];
  };
}

const FollowListModal = ({
  isOpen,
  onClose,
  type,
  followData,
}: FollowListModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const title = type === "following" ? "팔로잉" : "팔로워";

  const handleUserClick = (userId: number) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 h-[500px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {followData.followerCount === 0 && followData.followingCount === 0 ? (
            <p className="text-center text-gray-500">
              {type === "following"
                ? "팔로잉하는 사용자가 없습니다."
                : "팔로워가 없습니다."}
            </p>
          ) : (
            <ul className="space-y-4">
              {type === "following" &&
                followData.followingIdList.map((id, index) => (
                  <li
                    key={id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleUserClick(id)}
                  >
                    <img
                      src={noUserImg}
                      alt={followData.followingNicknameList[index]}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="font-medium">
                      {followData.followingNicknameList[index]}
                    </span>
                  </li>
                ))}
              {type === "followers" &&
                followData.followerIdList.map((id, index) => (
                  <li
                    key={id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => handleUserClick(id)}
                  >
                    <img
                      src={noUserImg}
                      alt={followData.followerNicknameList[index]}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="font-medium">
                      {followData.followerNicknameList[index]}
                    </span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
