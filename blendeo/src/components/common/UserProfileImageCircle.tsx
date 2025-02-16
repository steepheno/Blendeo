import { useNavigate } from "react-router-dom";
import noProfileImage from "@/assets/no_user.jpg";

export interface ProfileProps {
  userId: number,
  profileImage: string,
}

export function UserProfileImageCircle({
  profileImage,
  userId,
}: ProfileProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/profile/${userId}`);
  };
  return (
    <div>
      <div
        onClick={handleClick}
        className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
        role="button"
        aria-label={`Navigate to user ${userId}'s profile`}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={profileImage}
            alt={`User ${userId}'s profile`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = noProfileImage;
            }}
          />
        </div>
      </div>
    </div>
  );
}
