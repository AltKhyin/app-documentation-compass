
// ABOUTME: Filter and search panel for content queue with status filtering and search capabilities

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    status: 'all' | 'draft' | 'under_review' | 'scheduled' | 'published' | 'archived';
    search: string;
    authorId: string;
    reviewerId: string;
  };
  onFiltersChange: (filters: FilterPanelProps['filters']) => void;
  summary?: {
    draft: number;
    under_review: number;
    scheduled: number;
    published: number;
    archived: number;
  };
}

export const FilterPanel = ({ filters, onFiltersChange, summary }: FilterPanelProps) => {
  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as FilterPanelProps['filters']['status'],
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'under_review': return 'default';
      case 'scheduled': return 'outline';
      case 'published': return 'default';
      case 'archived': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or author..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Badges */}
      {summary && (
        <div className="flex flex-wrap gap-2">
          <Badge variant={getStatusBadgeVariant('draft')}>
            Draft: {summary.draft}
          </Badge>
          <Badge variant={getStatusBadgeVariant('under_review')}>
            Under Review: {summary.under_review}
          </Badge>
          <Badge variant={getStatusBadgeVariant('scheduled')}>
            Scheduled: {summary.scheduled}
          </Badge>
          <Badge variant={getStatusBadgeVariant('published')}>
            Published: {summary.published}
          </Badge>
          <Badge variant={getStatusBadgeVariant('archived')}>
            Archived: {summary.archived}
          </Badge>
        </div>
      )}
    </div>
  );
};
