import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import  { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {

  //Listagem de todas as memorias
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy:{
        createAt: 'asc',
      }
    })
    return memories.map(memory=> {
      return{
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...')
      }
    })
  })

  //detalhe de uma memoria
  app.get('/memories/:id', async (request) => {

    {/*Dessa forma da erro, pois o ID é do tipo desconhecido, pois o fastify 
      nao faz validacao nessa variavel, entao usamos o ZOD*/}
    //const { id } = request.params 

    
    {/*estrutura de validacao, se tiver certo vai retornar o ID, 
      caso contrario ira disparar um erro*/}
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    {/*Dessa forma pegamos o request.params e passamos para dentro do 
      paramsSchema para o ZOD fazer uma validacao e verificar se segue 
      a estrutura que definimos acima*/} 
    const { id } = paramsSchema.parse(request.params)

    {/* encontra a memoria com esse ID, se nao encontrar retorna um erro */}
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })
    return memory
  })

  //criacao de memoria
  app.post('/memories', async (request) => {

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '8c3c6c14-41cb-4e74-b0cf-4e19c53a32fd'
      }
    })
    return memory
  })

  //Atualizacao de memoria
  app.put('/memories/:id', async (request) => {

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where:{
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      }
    })
    return memory
  })

  //remover memoria
  app.delete('/memories/:id', async (request) => {

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })

  })



}


