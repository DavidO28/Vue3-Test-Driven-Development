vi.mock('@/views/activation/Activation.vue')
vi.mock('@/views/home/components/UserList.vue')
vi.mock('@/views/user/User.vue')
import App from '@/App.vue'
import { render, router, screen, waitFor } from 'test/helper'

const setup = async path => {
  router.push(path)
  await router.isReady()
  return render(App)
}

describe('Routing', () => {
  describe.each([
    { path: '/', pageId: 'home-page' },
    { path: '/signup', pageId: 'signup-page' },
    { path: '/activation/123', pageId: 'activation-page' },
    { path: '/activation/456', pageId: 'activation-page' },
    { path: '/user/1', pageId: 'user-page' },
    { path: '/user/2', pageId: 'user-page' },
    { path: '/password-reset/request', pageId: 'password-reset-request-page' },
    { path: '/password-reset/set', pageId: 'password-reset-set-page' },
  ])('renders home when $path is', ({ path, pageId }) => {
    it(`displays ${pageId}`, async () => {
      await setup(path)
      const page = screen.queryByTestId(pageId)
      expect(page).toBeInTheDocument()
    })
  })

  describe.each([
    {
      initialPath: '/',
      clickingTo: 'link-signup-page',
      visiblePage: 'signup-page',
    },
    {
      initialPath: '/signup',
      clickingTo: 'link-home-page',
      visiblePage: 'home-page',
    },
  ])(
    'when path is $initialPath',
    ({ initialPath, clickingTo, visiblePage }) => {
      describe(`when user clicks ${clickingTo}`, () => {
        it(`displays ${visiblePage}`, async () => {
          const { user } = await setup(initialPath)
          const link = screen.queryByTestId(clickingTo)
          await user.click(link)
          await waitFor(() => {
            expect(screen.queryByTestId(visiblePage)).toBeInTheDocument()
          })
        })
      })
    },
  )

  describe('when user is on home page', () => {
    describe('when user clicks on list item', () => {
      it('opens user page', async () => {
        const { user } = await setup('/')
        const link = await screen.findByText('test user')
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId('user-page')).toBeInTheDocument()
        })
      })
    })
  })
})
