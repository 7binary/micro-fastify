#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
user="postgres"
pw="postgres"

shift
cmd="$@"

until PGPASSWORD="$pw" psql -h "$host" -U "$user" -c '\q'; do
  >&2 echo "[POSTGRES] is not available ...sleeping"
  sleep 2
done

>&2 echo "[POSTGRES] CONNECTED >>> $cmd"
exec $cmd
