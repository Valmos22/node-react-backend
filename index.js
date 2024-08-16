import express from 'express'
import { PORT } from './config.js' // utilizar el puerto donde se va a levantar la aplicacion.
import { UserRepository } from './user-repository.js'

const app = express() // Se crea la aplicacion .
app.use(express.json()) // mira si la peticion trae algo raro en el cuerpo y l transforma

app.get('/', (req, res) => {
  res.send('Hello World! huguito')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserRepository.login({ username, password })
    res.send({ user })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/logout', (req, res) => {})

app.get('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
