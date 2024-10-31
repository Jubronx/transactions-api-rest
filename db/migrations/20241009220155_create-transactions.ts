import type { Knex } from 'knex'

// npm run knex -- migrate:rollback -> desfazer a migration para poder editar
// npm run knex -- migrate:make add-session-id-to-transactions // adiciona um campo chamado session id na tabela transaction

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary()
    table.text('title').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
