type ProfileStatsProps = {
  followingCount: string;
  followerCount: string;
};

function ProfileStats({ followingCount, followerCount }: ProfileStatsProps) {
  return (
    <div className="flex gap-3 items-start max-w-full min-h-[84px] w-[210px]">
      <div className="flex flex-col justify-center items-center min-h-[84px] w-[100px]">
        <div className="text-sm font-bold leading-none text-stone-900">
          Following
        </div>
        <div className="flex mt-2 min-h-[28px] w-[42px]" />
        <div className="mt-2 text-xs text-stone-500 w-[23px]">
          {followingCount}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center min-h-[84px] w-[100px]">
        <div className="text-sm font-bold leading-none text-stone-900 w-[62px]">
          Follower
        </div>
        <div className="flex mt-2 w-14 min-h-[28px]" />
        <div className="mt-2 w-5 text-xs text-stone-500">{followerCount}</div>
      </div>
    </div>
  );
}

export default ProfileStats;
