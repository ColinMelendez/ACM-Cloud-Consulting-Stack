import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Resource } from 'sst';

const app = new Hono();

app
	.use('*', cors())
	.get('/', (c) => {
		return c.text('Hello Hono!');
	})
	.post('/leads', async (c) => {
		const data = await c.req.parseBody();
		const { email, name, company, message } = data;

		try {
			await Resource.leadsDb
				.prepare('INSERT INTO leads (email, name, company, message) VALUES (?1, ?2, ?3, ?4)')
				.bind(email, name, company, message)
				.run();

			return c.json({ success: true }, 200);
		} catch (error) {
			return c.json({ success: false }, 500);
		}
	});

export default app;
