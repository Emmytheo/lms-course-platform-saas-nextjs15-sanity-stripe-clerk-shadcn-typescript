"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { syncUsersAction } from "@/actions/sync-users";

export function SyncStudentsButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        try {
            const result = await syncUsersAction();
            toast.success(`Synced ${result.count} profiles. Found ${result.enrolledUserCount} users with enrollments.`);
        } catch (error: any) {
            toast.error("Failed to sync students: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isLoading}
            className="gap-2"
        >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Syncing...' : 'Sync Students'}
        </Button>
    );
}
