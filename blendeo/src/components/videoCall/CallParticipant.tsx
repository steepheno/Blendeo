import { ParticipantData } from "@/types/components/video/videoCall";

interface CallParticipantProps {
  participant: ParticipantData;
}

export function CallParticipant({ participant }: CallParticipantProps) {
  return (
    <div className="flex overflow-hidden flex-col grow shrink self-stretch my-auto rounded-xl min-w-[240px] w-[376px] max-md:max-w-full">
      <div className="flex overflow-hidden relative flex-col pt-52 w-full rounded-xl min-h-[339px] max-md:pt-24 max-md:max-w-full">
        <img
          loading="lazy"
          src={participant.imageUrl}
          alt={`Video feed of ${participant.name}`}
          className="object-cover absolute inset-0 size-full"
        />
        <div className="flex overflow-hidden relative flex-col pt-24 pb-3 pl-3 min-h-[138px] max-md:pt-24 max-md:max-w-full">
          <div className="w-full max-md:max-w-full">{participant.name}</div>
        </div>
      </div>
    </div>
  );
}
