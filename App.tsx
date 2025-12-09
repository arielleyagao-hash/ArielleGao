import React, { useRef, useEffect, useState, useCallback } from 'react';
import { identifyGesture } from './services/geminiService';
import { DetectedNumber } from './types';
import { BirthdayCake } from './components/BirthdayCake';

// The secret code sequence
const TARGET_SEQUENCE: DetectedNumber[] = [2, 0, 2, 5, 1, 2, 2, 5];

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Game State
  const [sequence, setSequence] = useState<DetectedNumber[]>([]);
  const [lastDetected, setLastDetected] = useState<DetectedNumber>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string>("Initializing...");

  // Setup Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setFeedback("Show gestures to the camera");
      } catch (err) {
        console.error("Error accessing camera:", err);
        setFeedback("Camera access denied. Please allow camera access.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Capture and Analyze Frame
  const processFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing || isSuccess) return;

    setIsProcessing(true);

    try {
      // Draw video frame to canvas
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video is playing and has dimensions
      if (video.readyState !== 4) {
        setIsProcessing(false);
        return;
      }

      // Optimize: Downscale image to 320px width for faster transmission/processing
      const scaleFactor = 320 / video.videoWidth;
      canvas.width = 320;
      canvas.height = video.videoHeight * scaleFactor;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image for better UX
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 with lower quality for speed
        const base64Image = canvas.toDataURL('image/jpeg', 0.6);
        
        // Send to Gemini
        const result = await identifyGesture(base64Image);
        
        handleDetection(result.detected);
      }
    } catch (err) {
      console.error("Frame processing error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isSuccess, lastDetected, sequence]);

  // Polling Interval - Increased speed
  useEffect(() => {
    if (isSuccess) return;
    const intervalId = setInterval(processFrame, 200); // Fast polling (200ms)
    return () => clearInterval(intervalId);
  }, [processFrame, isSuccess]);

  const handleDetection = (detected: DetectedNumber) => {
    if (detected === null) {
        setLastDetected(null);
        return;
    }

    // Debounce: Ignore if same as last immediate detection
    if (detected === lastDetected) return;
    
    setLastDetected(detected);

    setSequence(prev => {
      const nextIndex = prev.length;
      
      // Check if detection matches the next needed number in target
      if (detected === TARGET_SEQUENCE[nextIndex]) {
        const newSequence = [...prev, detected];
        
        // Check win condition
        if (newSequence.length === TARGET_SEQUENCE.length) {
          setTimeout(() => setIsSuccess(true), 500); 
        }
        return newSequence;
      }
      
      return prev; 
    });
  };

  if (isSuccess) {
    return <BirthdayCake />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="max-w-md w-full relative">
            
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400 tracking-widest uppercase">Secret Access</h2>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-[0.2em]">Input Sequence Required</p>
            </div>

            {/* Video Feed Wrapper */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)] border-2 border-gray-800 bg-black aspect-[4/3]">
                <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror locally
                />
                
                {/* Overlay UI */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span className="text-xs font-mono text-white/80">
                            {isProcessing ? 'SCANNING' : 'READY'}
                        </span>
                    </div>
                </div>

                {/* Latest Detection Feedback */}
                {lastDetected !== null && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                        <span className="text-6xl font-bold text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse">
                            {lastDetected}
                        </span>
                    </div>
                )}
            </div>

            {/* Code Slots */}
            <div className="mt-8">
                <div className="flex justify-between gap-2 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    {TARGET_SEQUENCE.map((num, idx) => {
                        const isUnlocked = idx < sequence.length;
                        const isNext = idx === sequence.length;
                        return (
                            <div 
                                key={idx}
                                className={`
                                    relative flex-1 aspect-[3/4] flex items-center justify-center rounded-md border
                                    transition-all duration-300
                                    ${isUnlocked 
                                        ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                                        : isNext
                                            ? 'bg-gray-800 border-gray-600 shadow-inner'
                                            : 'bg-gray-900 border-gray-800 opacity-30'
                                    }
                                `}
                            >
                                <span className={`text-xl sm:text-2xl font-mono font-bold ${isUnlocked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-300`}>
                                    {num}
                                </span>
                                
                                {/* Lock Icon / Dot for empty slots */}
                                {!isUnlocked && (
                                    <div className={`w-1.5 h-1.5 rounded-full ${isNext ? 'bg-blue-400 animate-pulse' : 'bg-gray-700'}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {/* Visual Guide */}
                <div className="mt-8 grid grid-cols-4 gap-4 text-center">
                    {[
                        { num: 0, label: 'Fist' },
                        { num: 1, label: 'Index' },
                        { num: 2, label: 'Peace' },
                        { num: 5, label: 'Palm' }
                    ].map((item) => (
                        <div key={item.num} className="bg-gray-800/40 rounded-lg p-2 border border-gray-700/50">
                            <div className="text-blue-400 font-bold text-lg">{item.num}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}