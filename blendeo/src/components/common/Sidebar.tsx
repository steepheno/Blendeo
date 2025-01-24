import { SidebarItem } from './SidebarItem';
import { SubscriptionItem } from './SubscriptionItem';

const sidebarItems = [
	{ icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2773c8ae867c168434eaa09658e0bf5ca92644170e4886703b307de3e36bd802?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "홈", isActive: true },
	{ icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/12210756f538fe6fa67316f5c82ddd736cfb12ec1ffb4a3e944e8b34a0eb4370?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "탐색" },
	{ icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/89a0072ef0dbff743855d5c27a472bde87b46dbf1c2df85532ab140f348af1d3?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "채팅" },
	{ icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dc1dd8425faea0ea03838faca2a0ae63608db905b6381b8afeacda1218d866b2?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "Studio" },
	{ icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/10442a81aaba3d34107e6c64311b1f79a99edf436b7668568be30496a74d8cb5?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b", label: "내 정보" }
];

const subscriptionItems = [
	{
		imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/ccbdeea84866b8c6dd74176cc8e180464719262612a895eaa2e4017e5beb77bf?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
		title: "Euphoria | Labrinth | Piano Cover",
		timeAgo: "1 month ago",
		views: "1.4M"
	},
	{
		imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/547063262c0cf9d7de0c9351202c78568e8a68d3c3d90bb56795be8577e23efb?placeholderIfAbsent=true&apiKey=b682f36019fa47c8ad11d631a8d9d40b",
		title: "Viva La Vida | Coldplay | Violin Cover",
		timeAgo: "2 months ago",
		views: "3.2M"
	}
];

const Sidebar = () => {
  return (
		// 사이드바
    <div className="flex flex-col justify-between p-4 w-full bg-white bg-opacity-0 min-h-[723px]">
			<div className="flex flex-col w-full">
				<div className="flex flex-col flex-1 w-full">
					{sidebarItems.map((item, index) => (
							<SidebarItem key={index} {...item} />
					))}
				</div>
			</div>
			<button className="flex overflow-hidden justify-center items-center px-4 mt-96 w-full text-sm font-bold text-center text-white bg-violet-700 rounded-3xl max-w-[480px] min-h-[40px] min-w-[84px] max-md:mt-10">
				<div className="overflow-hidden self-stretch my-auto w-[47px]">Sign in</div>
			</button>
			
			{/* 구독 */}
			<div className="flex flex-col pl-2.5 max-w-full w-[281px]">
				<div className="px-4 pt-4 pb-2 w-full text-lg font-bold leading-none whitespace-nowrap min-h-[47px] text-neutral-900">구독중</div>
				{subscriptionItems.map((item, index) => (
					<SubscriptionItem key={index} {...item} />
				))}
			</div>
		</div>
  );
};

export default Sidebar;