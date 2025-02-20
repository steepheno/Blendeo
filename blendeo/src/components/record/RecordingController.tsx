import { ReactElement, useEffect } from "react"

interface RecordingControllerProps {
    onTimerChange: (time: number) => void
    isRecording: boolean
}

export function RecordingController({
    onTimerChange,
    isRecording
}: RecordingControllerProps): ReactElement | null {
    useEffect(() => {
        // undefined로 초기화
        let interval: ReturnType<typeof setInterval> | undefined = undefined

        if(isRecording) {
            let currentTime = 0
            interval = setInterval(() => {
                currentTime += 1
                onTimerChange(currentTime)
            }, 1000)
        } else {
            onTimerChange(0)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isRecording, onTimerChange])

    return null
}