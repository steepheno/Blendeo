import mainImg from "@/assets/mainImg.png";

const HeroSection = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${mainImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      className="flex flex-col w-full text-5xl font-black tracking-tighter text-white leading-[60px] min-h-[366px]"
    >
      <div className="flex flex-col justify-center p-4 w-full">
        <div className="flex overflow-hidden flex-col justify-center px-5 py-8 w-full rounded-xl">
          <div className="flex self-center max-w-full min-h-[120px] w-[893px]" />
          <div className="mt-8">
            Dive into a world of
            <br />
            music creation and discovery
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;