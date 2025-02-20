import { ReactElement } from "react"
import { Circle } from "lucide-react"

interface RecordingTimerProps {
    isRecording: boolean
    timer: number
}

export function RecordingTimer({
    isRecording, 
    timer
}: RecordingTimerProps) : ReactElement | null {
    if (!isRecording) return null
    
    const minutes = Math.floor(timer / 60)
    const seconds = (timer % 60).toString().padStart(2, "0")

    return (
    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
        <Circle className="h-3 w-3 fill-red-500 text-red-500" />
        <span className="text-sm font-medium text-white">
        {minutes}:{seconds}
        </span>
    </div>
    )
}