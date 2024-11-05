import { Hono } from "hono";

const app = new Hono();

app.get("/:name?", (c) => {
  const { name } = c.req.param();
  return c.text(`Hello ${name}`);
});

export default app;
