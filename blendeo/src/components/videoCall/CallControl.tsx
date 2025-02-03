import { CallControlProps } from "@/types/components/video/videoCall";

export function CallControl({
  icon,
  alt,
  isActive = false,
  onClick,
}: CallControlProps) {
  const baseClasses =
    "flex overflow-hidden justify-center items-center self-stretch my-auto w-6";
  const activeClasses = isActive ? "bg-violet-700 rounded-3xl" : "";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses}`}
      aria-label={alt}
      tabIndex={0}
    >
      <img
        loading="lazy"
        src={icon}
        alt={alt}
        className="object-contain w-6 aspect-square"
      />
    </button>
  );
}
