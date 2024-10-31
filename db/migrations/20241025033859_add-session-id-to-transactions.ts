import type { Knex } from 'knex'

// index -> cria automaticamente um indice, que é basicamente uma forma de falar para o banco de dados que o session_id sera muito utilizado dentro de um WHERE

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('session_id')
  })
}
