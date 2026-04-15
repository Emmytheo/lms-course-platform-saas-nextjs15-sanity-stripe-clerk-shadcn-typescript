"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSessionAction } from "@/actions/checkout";
import { useState } from "react";
import { Loader2, CreditCard, Banknote, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { enrollFreeAction } from "@/actions/enroll-free";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/db";
import { createPaymentRequestAction } from "../actions/payments";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone";
import { createClient } from "@/lib/client";
import { useEffect as useAuthEffect } from "react";

interface EnrollButtonProps {
  itemId: string;
  itemType: 'course' | 'exam' | 'learning-path';
  title: string;
  description?: string;
  price: number | null | undefined;
  isEnrolled?: boolean;
  returnUrl?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function EnrollButton({
  itemId,
  itemType,
  title,
  description = "",
  price,
  isEnrolled = false,
  returnUrl,
  variant = "default",
  size = "default",
  className
}: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [proofUrl, setProofUrl] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useAuthEffect(() => {
    const getSession = async () => {
        const { data } = await createClient().auth.getSession();
        setUserId(data.session?.user.id || null);
    };
    getSession();
  }, []);

  const upload = useSupabaseUpload({
    bucketName: 'payment-proofs',
    path: userId || 'anonymous',
    maxFiles: 1,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  const handleEnrollFree = async () => {
    setIsLoading(true);
    try {
      await enrollFreeAction(itemId, itemType);
      toast.success("Enrolled successfully!");
      if (returnUrl) router.push(returnUrl);
      else router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const { url } = await createCheckoutSessionAction(
        itemId,
        itemType,
        title,
        description,
        price || 0,
        returnUrl || window.location.href
      );
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || "Payment failed to start");
      setIsLoading(false);
    }
  };

  const handleManualRequest = async () => {
    setIsManualLoading(true);
    try {
      // If a file is selected but not uploaded, we should ideally upload it first
      // But we'll assume the user clicked 'Upload' in the Dropzone
      // If we want to be foolproof, we check if upload.isSuccess is true
      
      let finalProofUrl = proofUrl;
      const uploadedFile = upload.successes[0];
      if (uploadedFile && !finalProofUrl) {
          // Construct the URL manually if not already set
          // In a real app, you'd get the project URL from env
          const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
          finalProofUrl = `${projectUrl}/storage/v1/object/public/payment-proofs/${userId || 'anonymous'}/${uploadedFile}`;
      }

      await createPaymentRequestAction({
        item_id: itemId,
        item_type: itemType,
        amount: price || 0,
        proof_url: finalProofUrl
      });
      setRequestSent(true);
      toast.success("Request submitted for approval!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request");
    } finally {
      setIsManualLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button variant="outline" size={size} className={`${className} bg-green-500/10 text-green-500 border-green-500/20`} disabled>
        <CheckCircle2 className="w-4 h-4 mr-2" /> Enrolled
      </Button>
    );
  }

  if (!price || price === 0) {
    return (
      <Button onClick={handleEnrollFree} disabled={isLoading} variant={variant} size={size} className={className}>
        {isLoading && <Loader2 className="mr-2 h-4 h-4 animate-spin" />}
        Enroll for Free
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
                onClick={handleStripePayment}
                disabled={isLoading}
                variant={variant}
                size={size}
                className={`flex-1 font-bold tracking-tight h-12 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all ${className}`}
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                Pay ${price} (Instant)
            </Button>

            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size={size} 
                    className="flex-1 font-bold h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 transition-all"
                >
                    <Banknote className="w-4 h-4 mr-2" />
                    Manual Transfer
                </Button>
            </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[425px] bg-card border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">Manual <span className="text-primary">Transfer</span></DialogTitle>
            <DialogDescription className="text-muted-foreground">
                Follow the instructions below to complete your enrollment manually.
            </DialogDescription>
          </DialogHeader>

          {!requestSent ? (
            <div className="space-y-6 py-4">
                <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-primary">Bank Name</p>
                        <p className="font-bold text-lg">SkillHub Global Bank</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-primary">Account Number</p>
                        <p className="font-bold text-2xl tracking-tighter">0123 4567 8910</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black tracking-widest text-primary">Account Name</p>
                        <p className="font-bold">SkillHub Education Ecosystem Ltd.</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-bold">Upload Proof of Payment</p>
                    <Dropzone {...upload} className="py-8">
                        <DropzoneEmptyState />
                        <DropzoneContent />
                    </Dropzone>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-muted-foreground leading-relaxed">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <p>Once you've made the transfer and uploaded the receipt, click the button below. Our admins will verify the payment and grant access within 2-4 hours.</p>
                </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Request Submitted!</h3>
                <p className="text-sm text-muted-foreground">We've received your request. You'll be notified once access is granted.</p>
            </div>
          )}

          <DialogFooter>
            {!requestSent ? (
                <Button 
                    onClick={handleManualRequest} 
                    disabled={isManualLoading}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest"
                >
                    {isManualLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "I've Made the Transfer"}
                </Button>
            ) : (
                <Button 
                    onClick={() => setShowManualDialog(false)}
                    variant="outline"
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest"
                >
                    Close
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
