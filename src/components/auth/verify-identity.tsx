"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, CheckCircle, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { motion } from "framer-motion";

type VerifyIdentityProps = {
    onVerificationComplete: () => void;
};

export function VerifyIdentity({ onVerificationComplete }: VerifyIdentityProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setHasCameraPermission(false);
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
            }
        };

        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, []);

    const handleVerify = async () => {
        setIsVerifying(true);
        setVerificationStatus('verifying');
        
        // Simulate AI verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real app, you would capture a frame, send it to your AI flow,
        // and get a result. We'll simulate a successful result here.
        const isSuccess = Math.random() > 0.1; // 90% success rate for demo

        if (isSuccess) {
            setVerificationStatus('success');
             await new Promise(resolve => setTimeout(resolve, 1500));
            onVerificationComplete();
        } else {
            setVerificationStatus('failed');
            toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: 'Could not verify your ID. Please try again.',
            });
        }
        setIsVerifying(false);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 h-full">
            <h3 className="text-lg font-semibold mb-2">Verify Your Identity</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
                Please position your government-issued ID in front of the camera.
            </p>

            <div className="w-full aspect-video rounded-md bg-muted overflow-hidden relative flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                {!hasCameraPermission && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center">
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser settings to use this feature.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>

            <div className="w-full mt-4 h-16">
            {verificationStatus === 'idle' && (
                <Button onClick={handleVerify} disabled={isVerifying || !hasCameraPermission} className="w-full">
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <Camera className="mr-2 h-4 w-4" />
                            Verify ID
                        </>
                    )}
                </Button>
            )}

            {verificationStatus === 'verifying' && (
                 <div className="flex flex-col items-center justify-center text-center text-sm text-primary">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="mt-2 font-semibold">Analyzing ID...</p>
                 </div>
            )}
             {verificationStatus === 'success' && (
                <motion.div initial={{scale: 0.5, opacity: 0}} animate={{scale: 1, opacity: 1}} className="flex flex-col items-center justify-center text-center text-sm text-green-600">
                    <ShieldCheck className="h-8 w-8" />
                    <p className="mt-2 font-semibold">Verification Complete!</p>
                </motion.div>
            )}

             {verificationStatus === 'failed' && (
                 <div className="w-full space-y-4">
                    <Alert variant="destructive" className="text-center">
                        <AlertTitle>Verification Failed</AlertTitle>
                        <AlertDescription>Please ensure your ID is clear and try again.</AlertDescription>
                    </Alert>
                     <Button onClick={handleVerify} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            )}
            </div>
        </div>
    );
}
