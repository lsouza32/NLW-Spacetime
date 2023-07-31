import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'


const app = fastify()
const port = 3333

app.register(cors, {
  origin: true, //todas as urls de frontend podem acessar o backend
  // origin: ['http://localhost:3000', 'https://endereco-de-producao.com.br'] -> O melhor seria especificar a url que pode acesasr o backend
})

app.register(jwt,{
  secret: 'spacetime'
})


app.register(memoriesRoutes)
app.register(authRoutes)


app
  .listen({
    port,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  })
