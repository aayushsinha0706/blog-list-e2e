const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')
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
    await request.post('/api/users',{
        data: {
            name: 'Some Other Person',
            username: 'someotherperson',
            password: 'someotherperson'
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

  describe('When logged in', () => {

    beforeEach(async ({page}) => {
        await loginWith(page, 'aayushsinha0706', 'aayushsinha0706')
    })

    test('a new blog can be created' , async ({page}) => {
        const title = 'This is an example blog'
        const author = 'Aayush Sinha'
        const url = 'https://example.com'
        const username = 'aayushsinha0706'

        await createBlog(page, title, author, url)

        const message = await page.getByTestId('message')
        await expect(message).toContainText(`A new blog ${title} by ${username} has been added`)

        const blog = await page.getByTestId('blog')
        await expect(blog).toContainText(title)
    })

    describe('a blog has been created', () => {
        beforeEach(async ({page}) => {
            const title = 'This is an example blog'
            const author = 'Aayush Sinha'
            const url = 'https://example.com'
            await createBlog(page, title, author, url)
        })

        test('blog can be liked', async ({page}) => {
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            expect(page.getByText('likes: 1like')).toBeVisible()
        })

        test('blog can be deleted', async ({page}) => {
            await page.getByRole('button', { name: 'view' }).click()
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()
            await expect(page.getByTestId('blog')).not.toBeVisible()
        })

        test('test remove button visible only to owner', async ({page}) => {
            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

            await page.getByRole('button', { name: 'logout' }).click()
            await loginWith(page,'someotherperson','someotherperson')
            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
        })
    })

    describe('multiple blogs have been created', () => {
        beforeEach(async ({page}) => {
            await createBlog(page, 'This is an example blog', 'Aayush Sinha', 'https://example.com')
            await createBlog(page, 'Another example blog', 'Aayush Sinha', 'https://anotherexample.com')
            await createBlog(page, 'Third example blog', 'Aayush Sinha', 'https://thirdexampleblog.com')
        })

        test('test blogs ordered by likes descending', async ({page}) => {
            await likeBlog(page, 'This is an example blog',3)
            await likeBlog(page, 'Another example blog',5)
            await likeBlog(page, 'Third example blog',2)

            const firstBlog = await page.getByTestId('blog').first()
            await expect(firstBlog).toContainText('Another example blog')
            await expect(firstBlog).toContainText('likes: 5like')

            const secondBlog = await page.getByTestId('blog').nth(1)
            await expect(secondBlog).toContainText('This is an example blog')
            await expect(secondBlog).toContainText('likes: 3like')

            const thirdBlog = await page.getByTestId('blog').nth(2)
            await expect(thirdBlog).toContainText('Third example blog')
            await expect(thirdBlog).toContainText('likes: 2like')
        })
    })

  })
})