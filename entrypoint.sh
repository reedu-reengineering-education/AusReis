#!/bin/sh

find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0

if [ "$MIGRATE_DATABASE" = true ]
then
  echo "Running database migrations"
  npx --yes prisma migrate deploy
  npx --yes prisma db seed
else
  echo 'No Database migrations will be applied.'
  echo 'If there are missing Database migrations set environment variable MIGRATE_DATABASE to true'
fi

echo "Starting AusReis App"
exec "$@"