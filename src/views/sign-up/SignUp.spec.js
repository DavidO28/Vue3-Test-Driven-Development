import { render, screen } from '@testing-library/vue'
import SignUp from '@/views/sign-up/SignUp.vue'
import { expect } from 'vitest'

describe('Sign Up', () => {
  it('has Sign Up header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })
})
