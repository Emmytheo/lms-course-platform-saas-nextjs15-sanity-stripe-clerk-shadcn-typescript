// components/exam/SubmitDialog.js
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/DialogNew';
import { Button } from '@/components/ui/button';

export const SubmitDialog = ({ open, onOpenChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='transition-shadow bg-card shadow-lg rounded-md border border-border'>
        <DialogHeader>
          <DialogTitle className='text-primary'>Submit Exam?</DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            Are you sure you want to submit your exam? You won't be able to make changes after submission.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onSubmit}
          >
            Submit Exam
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};