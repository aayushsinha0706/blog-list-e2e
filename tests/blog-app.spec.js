const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users',{
        data: {
            name: 'Aayush Sinha',
            username: 'aayushsinha0706',
            password: 'aayushsinha0706'
        }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', {name: 'log in'}).click()
    const username = await page.getByTestId('username')
    const password = await page.getByTestId('password')
    expect(username).toBeVisible()
    expect(password).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({page}) => {
        await loginWith(page, 'aayushsinha0706', 'aayushsinha0706')
        await expect(page.getByText('Aayush Sinha is logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
        await loginWith(page, 'aayushsinha0706', 'wrongpassword')

        const errorDiv = await page.getByTestId('message')
        await expect(errorDiv).toContainText('Wrong username or password')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

  })
})