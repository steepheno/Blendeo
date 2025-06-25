type ActionButtonProps = {
  label: string;
  iconSrc: string;
  onClick?: () => void;
};

function ActionButton({ label, iconSrc, onClick }: ActionButtonProps) {
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      className="flex overflow-hidden gap-1.5 justify-center items-center px-3 bg-purple-500 rounded-2xl min-h-[27px] min-w-[57px]"
    >
      <img
        loading="lazy"
        src={iconSrc}
        alt=""
        className="object-contain shrink-0 self-stretch my-auto aspect-square w-[11px]"
      />
      <div className="overflow-hidden self-stretch my-auto w-9">{label}</div>
    </div>
  );
}

export default ActionButton;
