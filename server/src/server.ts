import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const port = 3333

const prisma = new PrismaClient()

app.get('/users', async () => {
  const users = await prisma.user.findMany()
  return users
})

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  })
