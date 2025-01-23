export interface SignalData {
    type: string;
    sdp?: string;
    candidate?: RTCIceCandidate;
  }