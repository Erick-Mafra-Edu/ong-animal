import React from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SwipeBoard } from './swipe-board'

describe('SwipeBoard', () => {
  it('renders the post-login swipe area', () => {
    render(<SwipeBoard />)

    expect(screen.getByText('Tela principal de swipe')).toBeInTheDocument()
    expect(screen.getByText('Yolo')).toBeInTheDocument()
  })

  it('updates counters when swiping', () => {
    render(<SwipeBoard />)

    fireEvent.click(screen.getByRole('button', { name: 'Curtir' }))

    expect(screen.getByText('Perfis restantes:')).toBeInTheDocument()
    expect(screen.getByText('Likes:')).toBeInTheDocument()
  })
})
