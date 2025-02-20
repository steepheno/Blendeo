import { useNavigate } from "react-router-dom";

const styles = `
  ::-webkit-scrollbar {
    display: none;
  }
`;

const LandingPage = () => {

  const navigate = useNavigate();

  const handleNavigateToMain = () => {
    navigate('/main');
  };


  return (
    <div className="relative">
      <style>{styles}</style>
      <div
        className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onClick={handleNavigateToMain}
      >
        {/* Hero Section */}
        <section
          className={`h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 snap-start snap-always transition-all duration-1000 ease-out transform overflow-hidden
            "opacity-100 scale-100 translate-y-0"`}
        >
          <div className="w-full max-w-2xl aspect-video">
            <div className="bg-center bg-no-repeat bg-contain bg-[url('/images/login_img.png')] w-full h-full" />
          </div>
          <div
            className={`w-full h-1/5 flex flex-col items-center justify-center gap-16 transition-all duration-700 transform
        "scale-100 translate-y-0"`}
          >
            <div className="text-center">
              <h1
                className="text-6xl font-bold text-white mb-2 animate-bounce transition-opacity duration-1000 delay-300"
              >
                BLENDEO
              </h1>
              <p
                className="text-2xl text-white animate-pulse transition-opacity duration-1000 delay-500"
              >
                세상의 모든 음악에 섞여 보세요
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={`h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 snap-start snap-always transition-all duration-700 ease-in-out transform overflow-hidden
        "opacity-100 scale-100 translate-y-0"`}
        >
          <div className="w-full max-w-xl aspect-video">
            <div className="bg-center bg-no-repeat bg-contain bg-[url('@/assets/landing_img.png')] w-full h-full" />
          </div>
          <p
            className="text-2xl mt-8 text-white animate-pulse transition-opacity duration-1000 delay-500"
          >
            세상의 모든 음악에 섞여 보세요
          </p>
          <div
            className={`text-center text-white transition-all duration-700 transform
          "scale-100 translate-y-0"`}
          ></div>
        </section>

        {/* Join Section */}
        <section
          className={`h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 snap-start snap-always transition-all duration-700 ease-in-out transform overflow-hidden
        "opacity-100 scale-100 translate-y-0"`}
        >
          <div
            className={`text-center text-white transition-all duration-700 transform
          "scale-100 translate-y-0"`}
          >
            <h2 className="text-5xl font-bold mb-8 animate-pulse">
              Shall we blend?
            </h2>
            <button className="bg-white text-purple-500 px-8 py-4 rounded-full text-xl font-semibold 
            hover:bg-opacity-90 hover:scale-110 hover:-translate-y-1 
            transition-all duration-300 transform"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToMain();
            }}
            >
              Get Started
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
