import { ProfileImageCircle } from "./ProfileImageCircle";
import { userMiniInfo } from "@/types/api/user";

interface UserMiniInfoProps {
    user: userMiniInfo;
    className?: string;  // optional className 추가
}

export function UserMiniInfo({ user, className = '' }: UserMiniInfoProps) {
    if (!user) {
        return null;
    }
    return (
        <div className={`flex flex-row gap-4 items-center ${className}`}>
            <div className="w-12 h-12 shadow-lg ring-2 ring-gray-100 ring-offset-2 rounded-full">
                <ProfileImageCircle
                    userId={user.userId}
                    profileImage={user.profileImage}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="font-semibold">{user.nickname}</span>
                {user.instruments?.length > 0 && (
                    <span className="inline-block bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm">
                        {user.instruments[0].instrument_name}
                    </span>
                )}
                {user.etcInstruments?.length > 0 && (
                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {user.etcInstruments[0].instrument_name}
                    </span>
                )}
            </div>
        </div>
    );
}