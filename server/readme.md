# AlienBook server 


# setup
 - todo



# code snippets (ignore this)
```bash
    db = (new Mongo('localhost:27017')).getDB('intellias')
    config={"_id":"mongodb-replicaset",
    "members":[{"_id":0,"host":"localhost:27017"}]}
    rs.initiate(config)

    docker run -p 27017:27017 -d mongo mongod --replSet mongodb-replicaset
```

# reference links 
    - [to configure mongo replica set + docker](https://www.upsync.dev/2021/02/02/run-mongo-replica-set.html) 
    - https://github.com/UpSync-Dev/docker-compose-mongo-replica-set#how-do-i-run-the-replica-set

