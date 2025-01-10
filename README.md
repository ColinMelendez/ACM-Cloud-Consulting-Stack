# ACM Consulting Leads App

## Development setup

### Install SST and PNPM

### Configure dev environment variables for deployments

## Structure

## Development Workflow

from the project root, running

```sh
pnpm run dev
```

will start the sst dev shell and create a fully-provisioned development stack, namespaced to the individual developer.

This includes:
    - Provisioning a D1 Database instance and auto-running the migration scripts on it.
    - Provisioning a worker API endpoint backend.
    - Starting a local Vite development server for the front end, and binding it to the worker API endpoint.

All of these are created as-needed on a per-developer basis via sst, and are re-used whenever the same developer starts their development stack with `pnpm run dev'. All of these feature hot-reloading for local changes made while the sst dev shell remains open.

## Production Deployment

Resources created by developers using pnpm run dev will not affect production environment's resources.

To deploy the project to production, execute

```sh
pnpm run deploy-production
```

which will:
    - Provision the database and workers if they are not already created
    - Update the script running in the workers with a rolling deployment (new connection redirected)
    - build the frontend and deploy it to a worker with static assets via wrangler

Note that migrations are NOT run on the database automatically. Migrations of production should be run manually by visiting `packages/database` and executing migrations.sql on the production database via wrangler. This is intended to ensure that whoever is running the migrations has a sufficient amount of intent to their actions to mitigate the possibility of data loss.

