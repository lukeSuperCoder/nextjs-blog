'use client'

/**
 * Markdown 渲染组件
 *
 * @说明
 * 使用 react-markdown + remark/rehype 插件支持 GFM、代码高亮和自定义渲染
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css'

import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={{
        h1({ className, ...props }) {
          return (
            <h1
              className={cn(
                'mt-8 scroll-m-20 text-4xl font-bold tracking-tight',
                className
              )}
              {...props}
            />
          )
        },
        h2({ className, ...props }) {
          return (
            <h2
              className={cn(
                'mt-8 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className
              )}
              {...props}
            />
          )
        },
        h3({ className, ...props }) {
          return (
            <h3
              className={cn(
                'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
                className
              )}
              {...props}
            />
          )
        },
        p({ className, ...props }) {
          return <p className={cn('leading-7', className)} {...props} />
        },
        ul({ className, ...props }) {
          return (
            <ul
              className={cn('my-6 ml-6 list-disc space-y-2', className)}
              {...props}
            />
          )
        },
        ol({ className, ...props }) {
          return (
            <ol
              className={cn('my-6 ml-6 list-decimal space-y-2', className)}
              {...props}
            />
          )
        },
        pre({ className, ...props }) {
          return (
            <pre
              className={cn(
                'mb-4 mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-sm',
                className
              )}
              {...props}
            />
          )
        },
        code({ inline, className, children, ...props }) {
          if (inline) {
            return (
              <code
                className={cn(
                  'rounded bg-muted px-1.5 py-0.5 font-mono text-sm',
                  className
                )}
                {...props}
              >
                {children}
              </code>
            )
          }

          return (
            <code className={cn('font-mono text-sm', className)} {...props}>
              {children}
            </code>
          )
        },
        a({ href, children, ...props }) {
          const isExternal = href?.startsWith('http')
          return (
            <a
              href={href}
              className="text-primary underline-offset-4 hover:underline"
              {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
              {...props}
            >
              {children}
            </a>
          )
        },
        img({ className, alt, ...props }) {
          return (
            <img
              className={cn('my-6 rounded-lg', className)}
              alt={alt ?? ''}
              loading="lazy"
              {...props}
            />
          )
        },
        table({ className, children, ...props }) {
          return (
            <div className="my-6 overflow-x-auto">
              <table
                className={cn('w-full text-sm [&_th]:text-left', className)}
                {...props}
              >
                {children}
              </table>
            </div>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
