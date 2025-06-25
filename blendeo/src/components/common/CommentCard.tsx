import { ProfileImageCircle } from "./ProfileImageCircle";
import type { Comment } from "@/types/api/commnet";

interface CommentCardProps {
    comment: Comment;
    className?: string;  // optional className 추가
  }

export function CommentCard({ comment, className ='' }: CommentCardProps) {
    if (!comment) {
        return null;
    }
    return (
        <div className={`flex flex-row gap-4 items-center ${className}`}>
            <div className="w-12 h-12 shadow-lg ring-2 ring-gray-100 ring-offset-2 rounded-full">
                <ProfileImageCircle
                    userId={comment.userId}
                    profileImage={comment.userProfile}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="font-semibold">{comment.userNickname}</span>
                <span>{comment.comment}</span>
            </div>
        </div>
    );
}