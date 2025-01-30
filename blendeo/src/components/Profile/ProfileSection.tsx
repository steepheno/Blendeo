import * as React from "react";
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
};

function ProfileSection({ username, displayName, userAvatar, tags, followingCount, followerCount }: ProfileSectionProps) {
  return (
    <div className="flex overflow-hidden flex-col w-full max-md:max-w-full">
      <div className="overflow-hidden self-stretch px-5 pt-8 w-full text-3xl font-bold text-black max-md:max-w-full">내 프로필</div>
      <div className="flex overflow-hidden relative gap-2.5 items-start px-2.5 mt-2.5 max-w-full w-[1566px]">
        <div className="flex overflow-hidden z-0 flex-col py-8 pl-px my-auto min-w-[240px]">
          <ProfileHeader username={username} displayName={displayName} userAvatar={userAvatar} tags={tags} />
          <div className="flex mt-2.5 min-h-[11px] w-[13px]" />
        </div>
        <div className="flex overflow-hidden absolute z-0 flex-col items-center self-start py-8 whitespace-nowrap h-[174px] left-[332px] min-h-[174px] top-[9px] w-[210px]">
          <ProfileStats followingCount={followingCount} followerCount={followerCount} />
          <div className="flex gap-9 items-start mt-1 text-xs font-bold text-center text-white">
            <ActionButton label="채팅하기" iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/6ae03550e188e9ec3bd261efe3de0597091556b30fd904fc17ffab674b0eeebc?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882" />
            <ActionButton label="통화하기" iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/399ab66881a5b3d65c810cdd774a95603999fbd9483f638f3fd03daf4b38912f?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;