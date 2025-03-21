const loginWith = async (page, username, password) => {
    await page.getByRole('button', {name: 'log in'}).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByPlaceholder('This is an example blog title').fill(title)
    await page.getByPlaceholder('Example author').fill(author)
    await page.getByPlaceholder('https://example.com').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

const likeBlog = async (page, blog, numberOfLikes) => {
    const blogDiv = await page.getByText(blog).locator('..')
    await blogDiv.getByRole('button', { name: 'view' }).click()
    const likeButton = await blogDiv.getByRole('button', { name: 'like' })
    for (let i = 0; i < numberOfLikes; i++){
        await likeButton.click()
        await page.getByText(blog).locator('..').waitFor()
    }
}

export {
    loginWith,
    createBlog,
    likeBlog
}