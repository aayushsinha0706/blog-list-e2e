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

export {
    loginWith,
    createBlog,
}