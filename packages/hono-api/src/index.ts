import { Hono } from 'hono'
import { Resource } from 'sst'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})
.get('/leads/:email/:name/:message', async (c) => {
  const { email, name, message } = c.req.param()

  // await Resource
  await Resource.leadsDb.prepare(
    'INSERT INTO leads (name, email, message) VALUES (?1, ?2, ?3)'
  )
  .bind(name, email, message)
  .run();

  return c.json({ message: 'Lead added' })
});

export default app
