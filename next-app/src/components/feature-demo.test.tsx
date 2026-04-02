import React from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureDemo } from './feature-demo'

describe('FeatureDemo', () => {
  it('renders the interactive presentation title', () => {
    render(<FeatureDemo />)

    expect(screen.getByText('Simule a experiência de adoção em tempo real.')).toBeInTheDocument()
    expect(screen.getByText('Yolo')).toBeInTheDocument()
  })
})
