vi.mock('./api')
vi.mock('vue-i18n')
import { render, screen, waitFor } from '@testing-library/vue'
import SignUp from './SignUp.vue'
import userEvent from '@testing-library/user-event'
import en from '@/locales/translations/en.json'
import { useI18n } from 'vue-i18n'
import { signUp } from './api'

vi.mocked(useI18n).mockReturnValue({
  t: (key) => en[key]
})

beforeEach(() => {
  vi.clearAllMocks()
})

const setup = async () => {
  const user = userEvent.setup()
  const result = render(SignUp, {
    global: {
      mocks: {
        $t: (key) => en[key]
      }
    }
  })
  const usernameInput = screen.getByLabelText('Username')
  const emailInput = screen.getByLabelText('E-mail')
  const passwordInput = screen.getByLabelText('Password')
  const passwordRepeatInput = screen.getByLabelText('Password Repeat')
  await user.type(usernameInput, 'user1')
  await user.type(emailInput, 'user1@mail.com')
  await user.type(passwordInput, 'P4ssword')
  await user.type(passwordRepeatInput, 'P4ssword')
  const button = screen.getByRole('button', { name: 'Sign Up' })
  return {
    ...result,
    user,
    elements: {
      button,
      usernameInput,
      emailInput,
      passwordInput,
      passwordRepeatInput
    }
  }
}

describe('Sign Up', () => {
  describe('when user sets same value for password inputs', () => {
    describe('when user submits form', () => {
      it('sends username, email, password to the backend', async () => {
        signUp.mockResolvedValue({ data: {} })
        const {
          user,
          elements: { button }
        } = await setup()
        await user.click(button)
        expect(signUp).toHaveBeenCalledWith({
          username: 'user1',
          email: 'user1@mail.com',
          password: 'P4ssword'
        })
      })
      describe('when there is an ongoing api call', () => {
        it('does not allow clicking the button', async () => {
          signUp.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          await user.click(button)
          expect(signUp).toHaveBeenCalledTimes(1)
        })
        it('displays spinner', async () => {
          signUp.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
          )
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          expect(screen.getByRole('status')).toBeInTheDocument()
        })
      })

      describe('when success response is received', () => {
        beforeEach(() => {
          signUp.mockResolvedValue({ data: { message: 'User create success' } })
        })
        it('displays message received from backend', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const text = await screen.findByText('User create success')
          expect(text).toBeInTheDocument()
        })

        it('hides sign up form', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          const form = screen.getByTestId('form-sign-up')
          await user.click(button)
          await waitFor(() => {
            expect(form).not.toBeInTheDocument()
          })
        })
      })

      describe('when network failure occurs', () => {
        beforeEach(() => {
          signUp.mockRejectedValue({})
        })
        it('displays generic message', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const text = await screen.findByText('Unexpected error occurred, please try again')
          expect(text).toBeInTheDocument()
        })

        it('hides spinner', async () => {
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument()
          })
        })

        describe('when user submits again', () => {
          it('hides error when api request is progress', async () => {
            signUp.mockRejectedValueOnce({}).mockResolvedValue({ data: {} })
            const {
              user,
              elements: { button }
            } = await setup()
            await user.click(button)
            const text = await screen.findByText('Unexpected error occurred, please try again')
            await user.click(button)
            await waitFor(() => {
              expect(text).not.toBeInTheDocument()
            })
          })
        })
      })

      describe.each([
        { field: 'username', message: 'Username cannot be null' },
        { field: 'email', message: 'E-mail cannot be null' },
        { field: 'password', message: 'Password cannot be null' }
      ])('when $field is invalid', ({ field, message }) => {
        it(`displays ${message}`, async () => {
          signUp.mockRejectedValue({
            response: {
              status: 400,
              data: {
                validationErrors: {
                  [field]: message
                }
              }
            }
          })
          const {
            user,
            elements: { button }
          } = await setup()
          await user.click(button)
          const error = await screen.findByText(message)
          expect(error).toBeInTheDocument()
        })
        it(`clears error after user updates ${field}`, async () => {
          signUp.mockRejectedValue({
            response: {
              status: 400,
              data: {
                validationErrors: {
                  [field]: message
                }
              }
            }
          })
          const { user, elements } = await setup()
          await user.click(elements.button)
          const error = await screen.findByText(message)
          await user.type(elements[`${field}Input`], 'updated')
          expect(error).not.toBeInTheDocument()
        })
      })
    })
  })
})