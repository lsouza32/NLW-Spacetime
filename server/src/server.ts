import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'


const app = fastify()
const port = 3333

app.register(cors, {
  origin: true, //todas as urls de frontend podem acessar o backend
  // origin: ['http://localhost:3000', 'https://endereco-de-producao.com.br'] -> O melhor seria especificar a url que pode acesasr o backend

  

})
app.register(memoriesRoutes)

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`)
  })
