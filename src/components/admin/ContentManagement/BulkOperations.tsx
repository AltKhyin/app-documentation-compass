
// ABOUTME: Bulk operations interface for managing multiple content items simultaneously

import React, { useState } from 'react';
import { useBulkOperationMutation } from '../../../../packages/hooks/useBulkOperationMutation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Archive, 
  Send, 
  AlertTriangle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface BulkOperationsProps {
  selectedReviews: number[];
  onComplete: () => void;
}

export const BulkOperations = ({ selectedReviews, onComplete }: BulkOperationsProps) => {
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const bulkOperationMutation = useBulkOperationMutation();

  const operations = [
    { 
      value: 'bulk_approve', 
      label: 'Approve Selected', 
      icon: CheckCircle, 
      description: 'Approve all selected reviews for publication',
      variant: 'default' as const
    },
    { 
      value: 'bulk_reject', 
      label: 'Reject Selected', 
      icon: XCircle, 
      description: 'Reject all selected reviews',
      variant: 'destructive' as const
    },
    { 
      value: 'bulk_schedule', 
      label: 'Schedule Selected', 
      icon: Calendar, 
      description: 'Schedule all selected reviews for future publication',
      variant: 'outline' as const
    },
    { 
      value: 'bulk_publish', 
      label: 'Publish Selected', 
      icon: Send, 
      description: 'Immediately publish all selected reviews',
      variant: 'default' as const
    },
    { 
      value: 'bulk_archive', 
      label: 'Archive Selected', 
      icon: Archive, 
      description: 'Archive all selected reviews',
      variant: 'secondary' as const
    },
  ];

  const handleBulkOperation = async () => {
    if (!selectedOperation) {
      toast.error('Please select an operation');
      return;
    }

    if (selectedReviews.length === 0) {
      toast.error('No reviews selected');
      return;
    }

    const operation = operations.find(op => op.value === selectedOperation);
    if (!operation) return;

    // Show confirmation for destructive operations
    if (['bulk_reject', 'bulk_archive'].includes(selectedOperation)) {
      const confirmed = window.confirm(
        `Are you sure you want to ${operation.label.toLowerCase()} ${selectedReviews.length} reviews? This action cannot be undone.`
      );
      if (!confirmed) return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await bulkOperationMutation.mutateAsync({
        operation: selectedOperation as any,
        reviewIds: selectedReviews,
        parameters: {
          // Add default scheduling for bulk_schedule operations
          ...(selectedOperation === 'bulk_schedule' && {
            scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
          })
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Show detailed results
      const successCount = result.results.filter(r => r.success).length;
      const failureCount = result.results.filter(r => !r.success).length;

      if (failureCount === 0) {
        toast.success(`Successfully ${operation.label.toLowerCase()} ${successCount} reviews`);
      } else {
        toast.warning(`Operation completed: ${successCount} successful, ${failureCount} failed`);
      }

      // Reset and close
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setSelectedOperation('');
        onComplete();
      }, 1000);

    } catch (error) {
      setIsProcessing(false);
      setProgress(0);
      toast.error(`Bulk operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const selectedOperationData = operations.find(op => op.value === selectedOperation);

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Bulk Operations
            <Badge variant="outline" className="ml-2">
              {selectedReviews.length} selected
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onComplete}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Operation Selection */}
        <div className="space-y-2">
          <Select value={selectedOperation} onValueChange={setSelectedOperation}>
            <SelectTrigger>
              <SelectValue placeholder="Select bulk operation..." />
            </SelectTrigger>
            <SelectContent>
              {operations.map((operation) => {
                const Icon = operation.icon;
                return (
                  <SelectItem key={operation.value} value={operation.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {operation.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {selectedOperationData && (
            <p className="text-sm text-gray-600">
              {selectedOperationData.description}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-600 text-center">
              Processing {selectedReviews.length} reviews... {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleBulkOperation}
            disabled={!selectedOperation || isProcessing || bulkOperationMutation.isPending}
            variant={selectedOperationData?.variant || 'default'}
            className="flex-1"
          >
            {selectedOperationData && (
              <selectedOperationData.icon className="h-4 w-4 mr-2" />
            )}
            {isProcessing ? 'Processing...' : (selectedOperationData?.label || 'Execute Operation')}
          </Button>
          <Button variant="outline" onClick={onComplete}>
            Cancel
          </Button>
        </div>

        {/* Warning Text */}
        <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
          <strong>Warning:</strong> Bulk operations affect multiple reviews simultaneously. 
          Please review your selection carefully before proceeding.
        </div>
      </CardContent>
    </Card>
  );
};
