
// ABOUTME: Rich text editor component using Tiptap with minimal extensions (StarterKit only) for post content creation.

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '../ui/button';
import { Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2, Link } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export const TiptapEditor = ({ content, onChange, placeholder = "Escreva sua discussão...", className }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Use default configuration for all StarterKit extensions
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Get content as HTML string for simplicity
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const toggleHeading1 = () => editor?.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () => editor?.chain().focus().toggleHeading({ level: 2 }).run();

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border rounded-md", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBold}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bold') && "bg-muted"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleItalic}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('italic') && "bg-muted"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border my-1 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleHeading1}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('heading', { level: 1 }) && "bg-muted"
          )}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleHeading2}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('heading', { level: 2 }) && "bg-muted"
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border my-1 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBulletList}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('bulletList') && "bg-muted"
          )}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleOrderedList}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('orderedList') && "bg-muted"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleBlockquote}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive('blockquote') && "bg-muted"
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[200px]"
      />
    </div>
  );
};
