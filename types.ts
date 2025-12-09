export type DetectedNumber = 0 | 1 | 2 | 5 | null;

export interface DetectionResult {
  detected: DetectedNumber;
  confidence?: number;
}
