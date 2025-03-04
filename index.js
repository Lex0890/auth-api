import express from 'express'
import { userRepository } from './local-db.js'
const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await userRepository.login({ username, password })
        res.send({ user })
    } catch (error) {
        if (error) return res.status(401).send('The username or the passwor are not correct')
    }
})
app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const id = await userRepository.create({ username, password })
        res.send({ id })
    } catch (error) {
        if (error) return res.status(400).send('The user already exists')

    }
})


app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}/`)
})