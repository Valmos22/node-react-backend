import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // 1: validaciones de usuarios
    Validation.username(username)
    Validation.password(password)

    // 2: verificar si existe un usuario
    const user = User.findOne({ username })
    if (user) throw new Error('El usuario ya existe')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('El usuario no existe')

    const isValid = await bcrypt.compareSync(password, user.password) // Compara la contrasena con la que tenemos en la bd
    if (!isValid) throw new Error('contrasena invalida')

    // const { password: _, ...publicUser } = user
    // return publicUser

    return {
      username: user.username
    }
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('username no es un string')
    if (username.length < 3) throw new Error('username tiene que ser de mas de 3 caracteres')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('username no es un string')
    if (password.length < 6) throw new Error('username tiene que ser de mas de 6 caracteres')
  }
}
