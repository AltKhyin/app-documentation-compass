
// ABOUTME: Advanced user list table with filtering, pagination, and bulk operations for admin user management

import React, { useState } from 'react';
import { useUserListQuery } from '@/packages/hooks/useUserManagementQuery';
import { useAvailableRolesQuery } from '@/packages/hooks/useRoleManagementQuery';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Users, 
  UserCheck,
  Shield,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDetailModal } from './UserDetailModal';
import { RoleAssignmentModal } from './RoleAssignmentModal';
import { BulkOperationsPanel } from './BulkOperationsPanel';

interface UserManagementFilters {
  role?: string;
  subscription_tier?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const UserListTable = () => {
  const [filters, setFilters] = useState<UserManagementFilters>({
    page: 1,
    limit: 20
  });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showRoleAssignment, setShowRoleAssignment] = useState(false);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

  // Fetch user data and available roles
  const { data: userListData, isLoading, error } = useUserListQuery(filters);
  const { data: rolesData } = useAvailableRolesQuery();

  // Handle search input
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1 // Reset to first page on search
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof UserManagementFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1 // Reset to first page on filter change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle user selection for bulk operations
  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  // Handle select all users
  const handleSelectAll = (checked: boolean) => {
    if (checked && userListData?.users) {
      setSelectedUserIds(userListData.users.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  // Handle user actions
  const handleUserAction = (userId: string, action: 'view' | 'assign-role' | 'edit') => {
    setSelectedUserId(userId);
    
    switch (action) {
      case 'view':
        setShowUserDetail(true);
        break;
      case 'assign-role':
        setShowRoleAssignment(true);
        break;
      case 'edit':
        setShowUserDetail(true);
        break;
    }
  };

  // Format user role for display
  const formatRole = (role: string) => {
    const roleVariant = role === 'admin' ? 'destructive' : 
                       role === 'editor' ? 'default' : 
                       role === 'moderator' ? 'secondary' : 'outline';
    
    const roleLabel = role === 'admin' ? 'Admin' :
                     role === 'editor' ? 'Editor' :
                     role === 'moderator' ? 'Moderador' : 'Praticante';
    
    return <Badge variant={roleVariant}>{roleLabel}</Badge>;
  };

  // Format subscription tier for display
  const formatSubscriptionTier = (tier: string) => {
    const tierVariant = tier === 'premium' ? 'default' : 'secondary';
    const tierLabel = tier === 'premium' ? 'Premium' : 'Gratuito';
    
    return <Badge variant={tierVariant}>{tierLabel}</Badge>;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar usuários: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasSelectedUsers = selectedUserIds.length > 0;

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários por nome..."
                className="pl-9"
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={filters.role || ''} 
                onValueChange={(value) => handleFilterChange('role', value)}
              >
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os papéis</SelectItem>
                  {rolesData?.availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role === 'admin' ? 'Admin' :
                       role === 'editor' ? 'Editor' :
                       role === 'moderator' ? 'Moderador' : 'Praticante'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.subscription_tier || ''} 
                onValueChange={(value) => handleFilterChange('subscription_tier', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Assinatura" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Operations Panel */}
          {hasSelectedUsers && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedUserIds.length} usuário(s) selecionado(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkOperations(true)}
                >
                  Ações em Massa
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      userListData?.users.length > 0 && 
                      selectedUserIds.length === userListData?.users.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead>Assinatura</TableHead>
                <TableHead>Contribuição</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="w-12">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : userListData?.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                userListData?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={(checked) => 
                          handleUserSelection(user.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <UserCheck className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          {user.profession_flair && (
                            <div className="text-xs text-muted-foreground">
                              {user.profession_flair}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatRole(user.role)}
                    </TableCell>
                    <TableCell>
                      {formatSubscriptionTier(user.subscription_tier)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{user.contribution_score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'assign-role')}>
                            Gerenciar Papéis
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>
                            Editar Usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {userListData?.pagination && userListData.pagination.total > userListData.pagination.limit && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {((userListData.pagination.page - 1) * userListData.pagination.limit) + 1} até{' '}
                {Math.min(
                  userListData.pagination.page * userListData.pagination.limit,
                  userListData.pagination.total
                )} de {userListData.pagination.total} usuários
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={userListData.pagination.page <= 1}
                  onClick={() => handlePageChange(userListData.pagination.page - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!userListData.pagination.hasMore}
                  onClick={() => handlePageChange(userListData.pagination.page + 1)}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showUserDetail && selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          open={showUserDetail}
          onOpenChange={setShowUserDetail}
        />
      )}

      {showRoleAssignment && selectedUserId && (
        <RoleAssignmentModal
          userId={selectedUserId}
          open={showRoleAssignment}
          onOpenChange={setShowRoleAssignment}
        />
      )}

      {showBulkOperations && (
        <BulkOperationsPanel
          selectedUserIds={selectedUserIds}
          open={showBulkOperations}
          onOpenChange={setShowBulkOperations}
          onComplete={() => {
            setSelectedUserIds([]);
            setShowBulkOperations(false);
          }}
        />
      )}
    </div>
  );
};
