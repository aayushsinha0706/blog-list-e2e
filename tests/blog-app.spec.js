const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', {name: 'log in'}).click()
    const username = await page.getByTestId('username')
    const password = await page.getByTestId('password')
    expect(username).toBeVisible()
    expect(password).toBeVisible()
  })
})