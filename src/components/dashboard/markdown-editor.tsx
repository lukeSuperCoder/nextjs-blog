'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MarkdownRenderer } from '@/components/post/markdown-renderer'
import { cn } from '@/lib/utils'

interface MarkdownEditorProps {
  name: string
  defaultValue?: string
  className?: string
}

export function MarkdownEditor({ name, defaultValue = '', className }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [value, setValue] = useState(defaultValue)

  const preview = useMemo(() => value, [value])

  return (
    <div className={cn('space-y-2', className)}>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === 'edit' ? 'default' : 'outline'}
          onClick={() => setMode('edit')}
        >
          编辑
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'preview' ? 'default' : 'outline'}
          onClick={() => setMode('preview')}
        >
          预览
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        {mode === 'edit' ? (
          <textarea
            className="min-h-[420px] w-full resize-y bg-transparent p-4 font-mono text-sm outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert p-4">
            <MarkdownRenderer content={preview} />
          </div>
        )}
      </div>
    </div>
  )
}
