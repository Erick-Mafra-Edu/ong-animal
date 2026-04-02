/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import React from 'react'
import '@testing-library/jest-dom/vitest'
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'
import { vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const sanitizedProps = { ...props }
    delete sanitizedProps.fill
    delete sanitizedProps.priority

    return <img alt={sanitizedProps.alt ?? ''} {...sanitizedProps} />
  },
}))