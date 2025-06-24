
// ABOUTME: Modal component for viewing and editing detailed user information in admin panel

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUpdateUserMutation } from '@/packages/hooks/useUserManagementQuery';
import { toast } from 'sonner';

interface UserDetailModalProps {
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
    subscription_tier: string;
    contribution_score: number;
    created_at: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    role: '',
    subscription_tier: '',
  });

  const updateUserMutation = useUpdateUserMutation();

  React.useEffect(() => {
    if (user) {
      setEditData({
        role: user.role,
        subscription_tier: user.subscription_tier,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        role: editData.role,
        subscriptionTier: editData.subscription_tier,
      });
      
      toast.success('User updated successfully');
      setEditMode(false);
      onClose();
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error updating user:', error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={user.full_name || 'Not provided'} disabled />
          </div>
          
          <div>
            <Label>Role</Label>
            {editMode ? (
              <Select value={editData.role} onValueChange={(value) => setEditData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practitioner">Practitioner</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <Input value={user.role} disabled />
                <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'editor' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
            )}
          </div>
          
          <div>
            <Label>Subscription Tier</Label>
            {editMode ? (
              <Select value={editData.subscription_tier} onValueChange={(value) => setEditData(prev => ({ ...prev, subscription_tier: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <Input value={user.subscription_tier} disabled />
                <Badge variant={user.subscription_tier === 'premium' ? 'default' : 'outline'}>
                  {user.subscription_tier}
                </Badge>
              </div>
            )}
          </div>
          
          <div>
            <Label>Contribution Score</Label>
            <Input value={user.contribution_score.toString()} disabled />
          </div>
          
          <div>
            <Label>Member Since</Label>
            <Input value={new Date(user.created_at).toLocaleDateString()} disabled />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          {editMode ? (
            <>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setEditMode(true)}>
                Edit User
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
