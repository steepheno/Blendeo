import * as React from "react";
import { SidebarItemProps } from "@/types/components/sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label }) => {
  console.log("\n=== SidebarItem Mount ===");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const routing = () => {
    console.log("\n=== SidebarItem Click ===");
    console.log("Clicked label:", label);
    console.log("Auth state at click:", {
      isAuthenticated,
      userId: user?.id,
    });

    switch (label) {
      case "홈":
        navigate("/");
        break;

      case "채팅":
        if (isAuthenticated) {
          navigate("/chat");
        } else {
          navigate("/auth/signin", {
            state: { from: "/chat" },
          });
        }
        break;

      case "내 정보":
        try {
          if (isAuthenticated) {
            navigate("/profile/me");
          } else {
            navigate("/auth/signin", {
              state: { from: "/profile/me" },
            });
          }
        } catch (error) {
          console.error("Navigation error:", error);
        }
        break;
    }
  };

  return (
    <div
      onClick={routing}
      className={`flex gap-3 items-center px-3 py-2 w-full hover:bg-gray-100 cursor-pointer hover:rounded-3xl`}
    >
      <div className="flex flex-col self-stretch my-auto w-6">
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain flex-1 w-6 aspect-square"
        />
      </div>
      <div className="self-stretch my-auto text-sm font-medium whitespace-nowrap text-neutral-900">
        {label}
      </div>
    </div>
  );
};

export default SidebarItem;
