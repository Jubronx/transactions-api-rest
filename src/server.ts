import { app } from './app'
import { env } from './env'

// npm init -y
// npm i -D typescript
// npx tsc --init
// npm install -D @types/node

// npm i eslint @rocketseat/eslint-config -D

// npx tsc src/server.ts // converte um arquivo ts em js
// node src/server.js -> roda o arquivo js
// npm install tsx -D
// npx tsx src/server.ts -> converte e roda o server e nao cria o arquivo js

// npm install knex sqlite3

// npm i vitest -D
// npm i supertest -D
// npm i --save-dev @types/supertest

app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? `0.0.0.0` : `localhost`,
  })
  .then(() => {
    console.log('HTTP Server Running')
  })
