import { CallParticipant } from "@/components/videoCall/CallParticipant";
import { CallControl } from "@/components/videoCall/CallControl";
import Layout from "@/components/layout/Layout";

const VideoCallPage = () => {
  const participants = [
    {
      id: "1",
      name: "You",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/382c8ba4e5132d09f1c36415c4160bcb66ebae06960e70f038ba90b757a3a07b?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
    },
    {
      id: "2",
      name: "Anna",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/1142f923a5475ac87fd13f8f7306aafe89d7d8776fdb9ae01c6ab3e1c831b272?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
    },
    {
      id: "3",
      name: "Barbara",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d47a2a70979d5bfa8f20829b60d59dcaad7671179d1f33d439c7f71077196723?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
    },
    {
      id: "4",
      name: "Cathy",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/7c4bb2ce7bc5838c563452d44cb378dece3f25b35e83ee512e4a61d8867df75f?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
    },
  ];

  const controls = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2ccdc9521569a4bf870d4bb5ad4719302eb5eed6e6c1dfdd1422e677f5cd558c?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
      alt: "Mute audio",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/acb669e26ea735003951d116a1f177a053d347bbc4815ad792ac4c4eb6cdd18d?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
      alt: "Disable video",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/72f0b6dc668fbfd9cc40cdba322ef4a1717cf5e322603a76b42f8d77b802893d?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
      alt: "Share screen",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/dc450210cb3f936b5d056b0cc0f8de07d9dc2e4619e0effd1bdbf037be4dc1f7?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
      alt: "More options",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/18a40f26b48b365ee39c2283a3572312d5787d8cb27bf8106bc1c97b054c2494?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
      alt: "Chat",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/543e9e29791d3a099956b5aba23d924e6343ba9fcd20b25794f98682c3bf4286?placeholderIfAbsent=true&apiKey=95b36dcff62b461b9ec9bc990aba2675",
      alt: "End call",
      isActive: true,
    },
  ];

  return (
    <Layout showNotification={false}>
      <div>
        <div className="flex flex-col flex-1 justify-center px-16 py-2.5 rounded-xl bg-violet-100 bg-opacity-0 max-md:px-5">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex flex-col w-full">
              {/* Header Section */}
              <header className="flex flex-wrap gap-3 items-center px-4 pt-4 pb-2 w-full border-b-2 border-violet-100 bg-gray-100 bg-opacity-0 max-md:max-w-full">
                <div className="flex items-center self-stretch my-auto w-12 min-h-[48px]">
                  <img
                    loading="lazy"
                    src="/api/placeholder/24/24"
                    alt="Call status icon"
                    className="object-contain self-stretch my-auto w-6 aspect-square"
                  />
                </div>
                <div className="flex-1 shrink self-stretch my-auto text-3xl font-bold leading-none text-black min-w-[240px] max-md:max-w-full">
                  {participants.map((p) => p.name).join(", ")}
                </div>
                <div className="self-stretch my-auto text-xl leading-10 text-neutral-500">
                  01:08:23
                </div>
                <div className="flex gap-1.5 justify-center items-center self-stretch my-auto w-12">
                  <img
                    loading="lazy"
                    src="/api/placeholder/24/24"
                    alt="Participants count"
                    className="w-6 h-6"
                  />
                  <span className="text-2xl">{participants.length}</span>
                </div>
              </header>

              {/* Main Video Grid */}
              <main className="flex flex-wrap gap-3 justify-center items-center px-4 w-full text-2xl leading-none text-white whitespace-nowrap bg-white bg-opacity-0 min-h-[742px] max-md:max-w-full">
                <div className="flex flex-wrap gap-3 justify-center items-center self-stretch my-auto min-w-[240px] w-[1012px]">
                  <div className="flex grow shrink items-start self-stretch my-auto min-w-[240px] w-[950px] max-md:max-w-full">
                    <div className="flex flex-wrap gap-3 justify-center items-center min-h-[722px] min-w-[240px] w-[954px]">
                      {participants.map((participant) => (
                        <CallParticipant
                          key={participant.id}
                          participant={participant}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer Controls */}
              <footer className="flex gap-2 justify-center items-center px-4 py-3 w-full border-t border-violet-100 max-md:max-w-full">
                <div className="flex gap-2 justify-center items-center self-stretch px-6 py-1.5 my-auto bg-white min-w-[240px] rounded-[100px] max-md:px-5">
                  <div className="flex gap-8 justify-center items-center self-stretch my-auto min-w-[240px]">
                    {controls.map((control, index) => (
                      <CallControl key={index} {...control} />
                    ))}
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoCallPage;
