vi.mock('axios')
import { render, screen } from '@testing-library/vue'
import SignUp from '@/views/sign-up/SignUp.vue'
import { describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

describe('Sign Up', () => {
  describe('when password and password repeat values match', () => {
    describe('when user submits form', () => {
      it('sends form values to backend', async () => {
        const user = userEvent.setup()
        render(SignUp)
        const usernameInput = screen.getByLabelText('Username')
        const emailInput = screen.getByLabelText('E-mail')
        const passwordInput = screen.getByLabelText('Password')
        const repeatPasswordInput = screen.getByLabelText('Password Repeat')
        await user.type(usernameInput, 'user1')
        await user.type(emailInput, 'user1@mail.com')
        await user.type(passwordInput, 'P4ssword')
        await user.type(repeatPasswordInput, 'P4ssword')
        const button = screen.getByRole('button', { name: 'Sign Up' })
        expect(screen.getByRole('button', { name: 'Sign Up' }))
        await user.click(button)
        expect(axios.post).toHaveBeenCalled('/api/v1/users', {
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword',
        })
      })
    })
  })
})
