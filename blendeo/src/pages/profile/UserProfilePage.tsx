// import React, { useState } from "react";
// import { Camera, Edit3, Music, Users, Share2 } from "lucide-react";
// import Button from "@/components/common/Button";
// import Layout from "@/components/layout/Layout";
// import TabNavigation from "@/components/common/TabNavigation";
// import VideoGrid from "@/components/common/VideoGrid";

// interface UserProfileProps {
//   isMyProfile?: boolean;
// }

// const UserPage: React.FC<UserProfileProps> = ({ isMyProfile = false }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState<"uploaded" | "liked">("uploaded");

//   return (
//     <Layout>
//       <div className="w-full bg-white">
//         {/* Channel Header */}
//         <div className="relative w-full h-40 bg-gradient-to-r from-purple-500 to-blue-500">
//           <img
//             src="/api/placeholder/1200/300"
//             alt="Channel header"
//             className="w-full h-40 object-cover"
//           />
//           {isMyProfile && (
//             <button className="absolute right-4 bottom-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
//               <Camera className="w-5 h-5" />
//             </button>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="max-w-5xl mx-auto px-4">
//           <div className="relative -mt-16">
//             {/* Profile Info Container */}
//             <div className="flex flex-col md:flex-row items-start gap-6">
//               {/* Profile Image */}
//               <div className="relative">
//                 <img
//                   src="/api/placeholder/128/128"
//                   alt="Profile"
//                   className="w-32 h-32 rounded-full border-4 border-white object-cover"
//                 />
//                 {isMyProfile && (
//                   <button className="absolute right-2 bottom-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
//                     <Camera className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>

//               {/* User Info */}
//               <div className="flex-1 pt-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h1 className="text-2xl font-bold">김블렌디오</h1>
//                     <p className="text-gray-600">@blendeo_kim</p>
//                   </div>
//                   <div className="flex gap-2">
//                     {isMyProfile ? (
//                       <Button
//                         onClick={() => setIsEditing(!isEditing)}
//                         variant="outline"
//                         className="flex items-center gap-2"
//                       >
//                         <Edit3 className="w-4 h-4" />
//                         프로필 수정
//                       </Button>
//                     ) : (
//                       <>
//                         <Button
//                           variant="outline"
//                           className="flex items-center gap-2"
//                         >
//                           <Share2 className="w-4 h-4" />
//                           공유
//                         </Button>
//                         <Button>팔로우</Button>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="flex gap-6 mt-4">
//                   <div className="flex items-center gap-2">
//                     <Users className="w-5 h-5 text-gray-600" />
//                     <div>
//                       <p className="font-semibold">1.3M</p>
//                       <p className="text-sm text-gray-600">팔로워</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="font-semibold">546</p>
//                     <p className="text-sm text-gray-600">팔로잉</p>
//                   </div>
//                   <div>
//                     <p className="font-semibold">238</p>
//                     <p className="text-sm text-gray-600">업로드</p>
//                   </div>
//                 </div>

//                 {/* Instruments */}
//                 <div className="flex items-center gap-2 mt-4">
//                   <Music className="w-5 h-5 text-gray-600" />
//                   <span className="text-gray-600">주 악기:</span>
//                   <div className="flex gap-2">
//                     <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
//                       기타
//                     </span>
//                     <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
//                       드럼
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 탭 네비게이션과 컨텐츠 */}
//           <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

//           {/* 탭 전환 애니메이션을 위한 컨테이너 */}
//           <div className="relative">
//             <div
//               className={`transition-opacity duration-200 ${
//                 activeTab === "uploaded"
//                   ? "opacity-100"
//                   : "opacity-0 absolute inset-0"
//               }`}
//             >
//               {activeTab === "uploaded" && <VideoGrid type="uploaded" />}
//             </div>
//             <div
//               className={`transition-opacity duration-200 ${
//                 activeTab === "liked"
//                   ? "opacity-100"
//                   : "opacity-0 absolute inset-0"
//               }`}
//             >
//               {activeTab === "liked" && <VideoGrid type="liked" />}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default UserPage;
