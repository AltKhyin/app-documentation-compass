
// ABOUTME: Bulk operations component for performing actions on multiple selected reviews

import React, { useState } from 'react';
import { useBulkOperationMutation } from '../../../../packages/hooks/useBulkOperationMutation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  Archive,
  Send,
  Calendar,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkOperationsProps {
  selectedReviews: number[];
  onComplete: () => void;
}

export const BulkOperations = ({ selectedReviews, onComplete }: BulkOperationsProps) => {
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const bulkMutation = useBulkOperationMutation();

  const handleBulkOperation = async () => {
    if (!selectedOperation) {
      toast.error('Please select an operation');
      return;
    }

    try {
      const result = await bulkMutation.mutateAsync({
        operation: selectedOperation as any,
        reviewIds: selectedReviews,
      });

      toast.success(`Bulk operation completed: ${result.processed}/${result.total} items processed`);
      onComplete();
    } catch (error) {
      toast.error(`Bulk operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const operationOptions = [
    { value: 'bulk_approve', label: 'Approve All', icon: CheckCircle },
    { value: 'bulk_reject', label: 'Reject All', icon: XCircle },
    { value: 'bulk_publish', label: 'Publish All', icon: Send },
    { value: 'bulk_archive', label: 'Archive All', icon: Archive },
    { value: 'bulk_schedule', label: 'Schedule All', icon: Calendar },
  ];

  if (bulkMutation.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing Bulk Operation...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing {selectedReviews.length} items</span>
              <span>Please wait...</span>
            </div>
            <Progress value={33} className="w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bulk Operations ({selectedReviews.length} items selected)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Select Operation
            </label>
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose bulk operation" />
              </SelectTrigger>
              <SelectContent>
                {operationOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            onClick={handleBulkOperation}
            disabled={!selectedOperation || bulkMutation.isPending}
          >
            Execute
          </Button>
          
          <Button
            variant="outline"
            onClick={onComplete}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
