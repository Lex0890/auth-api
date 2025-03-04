import DBLocal from 'db-local'
import crypto from 'node:crypto'
import bcrypt from 'bcrypt'

const salt = process.env.SALTY_ROUNDS || 10;

const { Schema } = DBLocal({ path: './db' })

const User = Schema('user', {
    _id: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true }
})
export class userRepository {
    static async create(username, password) {

        validation.username(username)
        validation.password(password)

        const user = User.findOne({ password })
        if (user) throw new Error('The username already exists');

        const hash = await bcrypt.hash({ salt })
        const id = crypto.randomUUID()

        User.create({
            _id: id,
            username,
            password: hash
        }).save()

        return id


    }

    static async login(username, password) {
        validation.username(username)
        validation.password(password)

        const user = User.findOne({ username })
        if (!user) throw new Error('Username does not exists')
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error('The password is not valid');

        const { password: _, ...publicUser } = user

        return publicUser

    }
}


class validation {
    static username(username) {
        if (typeof username !== String) throw new Error('Username must be a string');
        if (username.length < 3) throw new Error('Username must be at least 3 characters long');

    }
    static password(password) {
        if (typeof password !== String) throw new Error('The password must be a string');
        if (password.length < 8) throw new Error('The password must be at least 3 characters long');

    }
}