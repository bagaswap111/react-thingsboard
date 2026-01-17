# Hapus semua container yang ada
docker stop $(docker ps -aq) && docker rm $(docker ps -aq)

# Run ThingsBoard dengan H2 database saja
docker run -d \
  --name thingsboard-h2 \
  -p 8080:8080 \
  -p 1883:1883 \
  -e TB_QUEUE_TYPE=in-memory \
  -e LOAD_DEMO=true \
  -e DATABASE_TS_TYPE=cassandra \
  -v $(pwd)/data:/data \
  thingsboard/tb-postgres:latest