interface Window {
  facedetection: {
    initFaceDetection: (
      sizeFrameMemory: number, faceFinderPath: string, resultCallback: (result: any) => void
    ) => void;
    detections: (
      rgba: Uint8Array,
      width: number,
      height: number,
      minSizeFace: number,
      maxSizeFace: number,
      iouthreshold: number,
      resultCallback: (result: any) => void
    ) => void;
  };
}
