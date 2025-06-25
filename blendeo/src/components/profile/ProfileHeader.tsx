type ProfileHeaderProps = {
  username: string;
  displayName: string;
  userAvatar: string;
  tags: { imageSrc: string; label: string }[];
};

function ProfileHeader({
  username,
  displayName,
  userAvatar,
  tags,
}: ProfileHeaderProps) {
  return (
    <div className="flex gap-4 items-start">
      <img
        loading="lazy"
        src={userAvatar}
        alt={`${displayName} avatar`}
        className="object-contain shrink-0 w-32 aspect-[0.98] min-h-[128px] rounded-[64px]"
      />
      <div className="flex flex-col justify-center min-h-[128px] w-[165px]">
        <div className="w-full text-2xl font-bold leading-none whitespace-nowrap text-stone-900">
          {displayName}
        </div>
        <div className="mt-1 w-full text-base whitespace-nowrap text-stone-500">
          @{username}
        </div>
        <div className="flex gap-2 items-center py-2.5 mt-1 w-full text-xs leading-7 text-black">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex overflow-hidden gap-1 items-center self-stretch px-1 py-0.5 my-auto bg-white rounded shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
            >
              <img
                loading="lazy"
                src={tag.imageSrc}
                alt={tag.label}
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
              />
              <div className="self-stretch my-auto w-[26px]">{tag.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
