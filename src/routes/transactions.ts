import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionExists } from '../middlewares/check-session-id-exists'

// Cookies --> Serve para guardar informarcoes sobre as requisições, mesmo que o usuario nao esteja logado
// Teste Unitario - testa uma unidade da aplicação
// Teste de Integração - comunicação entre duas ou mais unidades
// Teste e2e - Ponta a ponta - simulam um usuario operando na aplicação
export async function transactionRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: checkSessionExists,
    },
    async (request) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: checkSessionExists,
    },
    async (request) => {
      const getTransactionsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: checkSessionExists,
    },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    // app.get('/hello', async () => {
    // const transaction = await knex('transactions')
    // .select('*')
    // .insert({
    //   id: crypto.randomUUID(),
    //   title: 'Transação de teste',
    //   amount: 1000,
    // })
    // .returning('*')

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )
    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
