
// ABOUTME: Tag cleanup and maintenance component for identifying and removing unused or problematic tags

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trash2, 
  AlertTriangle, 
  Check, 
  X,
  RefreshCw,
  FileSearch,
  Merge
} from 'lucide-react';
import { useTagManagementQuery, useTagOperationMutation, type TagWithStats } from '@/packages/hooks/useTagManagementQuery';

interface CleanupSuggestion {
  type: 'unused' | 'duplicate' | 'orphaned' | 'empty';
  tags: TagWithStats[];
  description: string;
  severity: 'low' | 'medium' | 'high';
  action: string;
}

export const TagCleanup = () => {
  const { data: tags = [], isLoading } = useTagManagementQuery();
  const tagOperationMutation = useTagOperationMutation();
  
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate cleanup suggestions based on tag data
  const generateCleanupSuggestions = (): CleanupSuggestion[] => {
    const suggestions: CleanupSuggestion[] = [];

    // Find unused tags
    const unusedTags = tags.filter(tag => tag.usage_count === 0);
    if (unusedTags.length > 0) {
      suggestions.push({
        type: 'unused',
        tags: unusedTags,
        description: `${unusedTags.length} tags não estão sendo utilizadas em nenhum conteúdo`,
        severity: 'medium',
        action: 'Remover tags não utilizadas'
      });
    }

    // Find potential duplicates (similar names)
    const duplicateGroups: { [key: string]: TagWithStats[] } = {};
    tags.forEach(tag => {
      const normalizedName = tag.tag_name.toLowerCase().trim();
      if (!duplicateGroups[normalizedName]) {
        duplicateGroups[normalizedName] = [];
      }
      duplicateGroups[normalizedName].push(tag);
    });

    Object.values(duplicateGroups).forEach(group => {
      if (group.length > 1) {
        suggestions.push({
          type: 'duplicate',
          tags: group,
          description: `Tags potencialmente duplicadas: ${group.map(t => t.tag_name).join(', ')}`,
          severity: 'high',
          action: 'Mesclar tags duplicadas'
        });
      }
    });

    // Find orphaned tags (no parent and no children)
    const orphanedTags = tags.filter(tag => 
      !tag.parent_id && !tags.some(t => t.parent_id === tag.id)
    );
    if (orphanedTags.length > 5) {
      suggestions.push({
        type: 'orphaned',
        tags: orphanedTags,
        description: `${orphanedTags.length} tags estão isoladas sem relações hierárquicas`,
        severity: 'low',
        action: 'Organizar em hierarquia'
      });
    }

    return suggestions;
  };

  const suggestions = generateCleanupSuggestions();

  const handleSuggestionSelect = (suggestionId: string, selected: boolean) => {
    setSelectedSuggestions(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(suggestionId);
      } else {
        newSet.delete(suggestionId);
      }
      return newSet;
    });
  };

  const handleBulkCleanup = async () => {
    if (selectedSuggestions.size === 0) return;

    setIsAnalyzing(true);
    try {
      const operations = [];
      
      suggestions.forEach((suggestion, index) => {
        const suggestionId = `${suggestion.type}-${index}`;
        if (selectedSuggestions.has(suggestionId)) {
          switch (suggestion.type) {
            case 'unused':
              operations.push({
                action: 'delete',
                bulkTagIds: suggestion.tags.map(t => t.id)
              });
              break;
            case 'duplicate':
              // For duplicates, merge into the most used tag
              const mostUsed = suggestion.tags.reduce((max, tag) => 
                tag.usage_count > max.usage_count ? tag : max
              );
              const toMerge = suggestion.tags.filter(t => t.id !== mostUsed.id);
              operations.push({
                action: 'merge',
                tagId: mostUsed.id,
                bulkTagIds: toMerge.map(t => t.id)
              });
              break;
            case 'orphaned':
              // For orphaned tags, we'll just flag them for manual review
              break;
          }
        }
      });

      for (const operation of operations) {
        await tagOperationMutation.mutateAsync(operation as any);
      }

      setSelectedSuggestions(new Set());
    } catch (error) {
      console.error('Cleanup failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <FileSearch className="h-4 w-4" />;
      case 'low': return <RefreshCw className="h-4 w-4" />;
      default: return <Check className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Limpeza de Tags</CardTitle>
          <CardDescription>Analisando tags do sistema...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Limpeza e Manutenção</CardTitle>
            <CardDescription>
              Identifique e resolva problemas na organização das tags
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            <Button 
              onClick={handleBulkCleanup}
              disabled={selectedSuggestions.size === 0 || isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Aplicar Selecionadas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 ? (
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              Ótimo! Não foram encontrados problemas na organização das tags.
              O sistema está limpo e bem organizado.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Summary */}
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">
                {suggestions.length} sugestões de limpeza encontradas
              </span>
              <Badge variant="outline">
                {selectedSuggestions.size} selecionadas
              </Badge>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => {
                const suggestionId = `${suggestion.type}-${index}`;
                const isSelected = selectedSuggestions.has(suggestionId);
                
                return (
                  <div 
                    key={suggestionId}
                    className={`border rounded-lg p-4 transition-colors ${
                      isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleSuggestionSelect(suggestionId, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${getSeverityColor(suggestion.severity)}`}>
                            {getSeverityIcon(suggestion.severity)}
                          </div>
                          <span className="font-medium">{suggestion.action}</span>
                          <Badge 
                            variant="outline"
                            className={getSeverityColor(suggestion.severity)}
                          >
                            {suggestion.severity}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {suggestion.description}
                        </p>
                        
                        {suggestion.tags.length <= 10 ? (
                          <div className="flex flex-wrap gap-1">
                            {suggestion.tags.map(tag => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.tag_name}
                                {tag.usage_count > 0 && (
                                  <span className="ml-1 text-gray-500">
                                    ({tag.usage_count})
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{suggestion.tags.length} tags afetadas</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0">
                              Ver detalhes
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning for destructive actions */}
            {selectedSuggestions.size > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Atenção:</strong> Algumas operações são irreversíveis. 
                  Certifique-se de revisar as sugestões antes de aplicar.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
