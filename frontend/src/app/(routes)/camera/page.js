//camera/page.js
"use client";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Repeat, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CameraPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check your permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        setIsCameraActive(false);
        if (videoRef.current.srcObject instanceof MediaStream) {
          videoRef.current.srcObject
            .getTracks()
            .forEach((track) => track.stop());
        }
      }
    }
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const savePhoto = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement("a");
      link.href = capturedImage;
      link.download = "captured_photo.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Photo Saved",
        description: "Your photo has been saved successfully.",
      });
    }
  }, [capturedImage, toast]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl font-bold mb-4">Camera</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-200 rounded-lg overflow-hidden">
        {isCameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {capturedImage && (
          <img
            src={capturedImage || "/placeholder.webp"}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" width={400} height={400} />
      </div>
      <div className="flex space-x-4">
        {!isCameraActive && !capturedImage && (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        )}
        {isCameraActive && (
          <Button onClick={capturePhoto}>
            <Camera className="mr-2 h-4 w-4" /> Capture
          </Button>
        )}
        {capturedImage && (
          <>
            <Button onClick={retakePhoto}>
              <Repeat className="mr-2 h-4 w-4" /> Retake
            </Button>
            <Button onClick={savePhoto}>
              <Download className="mr-2 h-4 w-4" /> Save
            </Button>
          </>
        )}
      </div>
      <div>Talaga</div>
    </div>
  );
}
