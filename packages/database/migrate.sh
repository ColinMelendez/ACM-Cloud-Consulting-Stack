#!/bin/bash

pnpx wrangler d1 execute "$DB_NAME" --remote --file=./leads-schema.sql --yes
