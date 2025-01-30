import Layout from "../Layout/Layout";

import ProfileSection from "../Profile/ProfileSection";
import VideoSection from "../Profile/VideoSection";

const Mypage = () => {
  const tags = [
    {
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/3cfd686c8979fc9df87b0da219112b1086c7de88b99667a87bc65c7b4ae4f2db?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      label: "# 드럼",
    },
    {
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/ce8ace9898899cd56b940c9f933a7aaaad5cbcea74bd1a9c7bf53b5dc1f4f4f9?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      label: "# 베이스",
    },
  ];

  const videos = [
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/87be716c5472827d2c4d008ebc545a462b2403c9b5751fae38c20e7dbb051624?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
    {
      thumbnailSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d3644dc7fb6e5db4c22fd06d9d7da0d2c0e4beb30bf8c8ecf3ebab4f3bb86a85?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882",
      title: "대학 밴드 동아리 cover 영상",
      username: "Minseo-Kim",
      views: "7만회",
      timeAgo: "13시간 전",
      tags: ["드럼", "베이스", "기타", "키보드"],
    },
  ];

  const likedVideos = videos; // Assuming liked videos are the same for the example

  return (
    <Layout showNotification>
      <div className="w-full">
        <ProfileSection
          username="blendeo_kim"
          displayName="김블랜디오"
          userAvatar="https://cdn.builder.io/api/v1/image/assets/TEMP/01f1ea5fafca4560a35106d44130a5213830c8fa8ce73231601417da13369c67?placeholderIfAbsent=true&apiKey=039fbd4dc53647c88d2eaa0a387bc882"
          tags={tags}
          followingCount="1.3m"
          followerCount="546"
        />
        <VideoSection title="내 영상들" videos={videos} />
        <VideoSection title="좋아요 누른 영상들" videos={likedVideos} />
      </div>
    </Layout>
  );
};

export default Mypage;
