import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import  { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request)=>{
    await request.jwtVerify()// Verifica se esta chegando o token, caso  nao estiver, nao deixa proseguir 
  })

  //Listagem de todas as memorias
  app.get('/memories', async (request) => {

    const memories = await prisma.memory.findMany({
      where:{
        userId: request.user.sub,
      },
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
  app.get('/memories/:id', async (request, reply) => {

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

    if(!memory.isPublic && memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

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
        userId: request.user.sub,
      }
    })
    return memory
  })

  //Atualizacao de memoria
  app.put('/memories/:id', async (request, reply) => {

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

    let memory = await prisma.memory.findUniqueOrThrow({
      where:{
        id,
      }
    })

    if(memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
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
  app.delete('/memories/:id', async (request, reply) => {

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where:{
        id,
      }
    })

    if(memory.userId !== request.user.sub){
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    })

  })

}


