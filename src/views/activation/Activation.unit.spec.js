vi.mock('@/composables/useRouteParamApiRequest')
import { render, screen } from '@testing-library/vue'
import useRouteParamApiRequest from '@/composables/useRouteParamApiRequest'
import Activation from './Activation.vue'
import { activate } from './api'

const mockUseRouteParamApiRequest = vi.mocked(useRouteParamApiRequest)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Activation', () => {
  beforeEach(() => {
    mockUseRouteParamApiRequest.mockReturnValue({
      status: 'loading',
      data: undefined,
      error: undefined,
    })
  })

  it('calls mockUseRouteParamApiRequest with expected params', () => {
    render(Activation)
    expect(mockUseRouteParamApiRequest).toHaveBeenCalledWith(
      activate,
      'token',
    )
  })

  describe('when status is loading', () => {
    it('displays spinner', () => {
      render(Activation)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('when status is success', () => {
    it('displays data message', () => {
      mockUseRouteParamApiRequest.mockReturnValue({
        status: 'success',
        data: { message: 'Success!!' },
        error: undefined,
      })
      render(Activation)
      expect(screen.getByText('Success!!')).toBeInTheDocument()
    })
  })

  describe('when status is fail', () => {
    it('displays error message', () => {
      mockUseRouteParamApiRequest.mockReturnValue({
        status: 'fail',
        data: undefined,
        error: 'Error occurred',
      })
      render(Activation)
      expect(screen.getByText('Error occurred')).toBeInTheDocument()
    })
  })
})
