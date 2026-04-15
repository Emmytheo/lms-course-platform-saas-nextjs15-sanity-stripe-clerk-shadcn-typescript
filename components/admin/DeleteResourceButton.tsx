'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DeleteResourceButtonProps {
    id: string;
    action: (id: string) => Promise<{ error?: string; success?: boolean } | undefined>;
    resourceName: string;
}

export function DeleteResourceButton({ id, action, resourceName }: DeleteResourceButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete this ${resourceName}?`)) return;

        setIsDeleting(true);
        try {
            const result = await action(id);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(`${resourceName} deleted successfully`);
                router.refresh();
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
    );
}
