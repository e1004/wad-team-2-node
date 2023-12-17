# wad-team-2-node
wad team 2 back end

Install dependencies

```bash
npm install
```

Create database "wad2"

```bash
psql -h localhost -p 5432 -U postgres
create database wad2;
```

And then run the server

```bash
npm run start
```

# Endpoint demos

## Sign up with a user

```bash
curl -X POST localhost:3000/auth/signup -d '{"email": "a@a.com", "password": "1234"}' -H "content-type:application/json"
{"user_id":"1156369b-af42-4b08-9d56-b23e6fa8d688"}

curl -X POST localhost:3000/auth/signup -d '{"email": "a@a.com", "password": "1234"}' -H "content-type:application/json"
duplicate key value violates unique constraint "app_user_email_key
```

## Login user

```bash
curl -i -X POST localhost:3000/auth/login -d '{"email": "a@a.com", "password": "1234"}' -H "content-type:application/json"
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Access-Control-Allow-Credentials: true
Set-Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlZDRlYjI5LTIxMTEtNDZhMS1hZDQ1LTk3NGVkNDk2MWZlNyIsImlhdCI6MTcwMjgzMzcyNiwiZXhwIjoxNzA4ODMzNzI2fQ.b3DpiPce1WObHB4heDEQFMms6Xab-hSYY1KzFx8_KVg; Max-Age=6000; Path=/; Expires=Sun, 17 Dec 2023 19:02:06 GMT; HttpOnly
Content-Type: application/json; charset=utf-8
Content-Length: 50
ETag: W/"32-usmxUAyzBxaKgCIqjRNTrXdxVWM"
Date: Sun, 17 Dec 2023 17:22:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"user_id":"3ed4eb29-2111-46a1-ad45-974ed4961fe7"}
```

## Authenticate user

```bash
curl localhost:3000/auth/authenticate --cookie "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlZDRlYjI5LTIxMTEtNDZhMS1hZDQ1LTk3NGVkNDk2MWZlNyIsImlhdCI6MTcwMjgzMzcyNiwiZXhwIjoxNzA4ODMzNzI2fQ.b3DpiPce1WObHB4heDEQFMms6Xab-hSYY1KzFx8_KVg; Max-Age=6000; Path=/; Expires=Sun, 17 Dec 2023 19:02:06 GMT; HttpOnly"
{"authenticated":true}
```

## Logout user

```bash
curl localhost:3000/auth/logout
```

## Create a new post

... without user

```bash
curl -X POST localhost:3000/posts -d '{"text": "lalala"}' -H "Content-Type: application/json"
{"data":{"id":"8681ac0f-305e-405d-87c9-25edfcd144d5","user_id":null,"created_at":"2023-12-17T13:13:20.307Z","text":"lalala","likes":0}}
```

... with user

```bash
 curl -X POST localhost:3000/posts -d '{"text": "Tere", "userId": "3ed4eb29-2111-46a1-ad45-974ed4961fe7"}' -H "Content-Type: application/json"
{"data":{"id":"17667cec-d75e-456c-b801-a8792d88715d","user_id":"3ed4eb29-2111-46a1-ad45-974ed4961fe7","created_at":"2023-12-17T13:17:52.512Z","text":"Tere","likes":0}}
```

## Update existing post

```bash
curl -i -X PATCH localhost:3000/posts/0a290bc2-c8b2-4c4d-b89d-0713bd2b7799 -d '{"text": "ghhhhhh"}' -H "Content-Type: application/json"
{"data":{"id":"0a290bc2-c8b2-4c4d-b89d-0713bd2b7799","user_id":null,"created_at":"2023-12-17T09:55:24.766Z","text":"ghhhhhh","likes":0}}
```

## Read all posts

```bash
curl localhost:3000/posts
{"data":[{"id":"23d3f38a-2301-43b6-a2ac-9b97c2bd1092","user_id":null,"created_at":"2023-12-16T18:14:18.197Z","text":"lalala","likes":0},{"id":"22c2bc0f-1344-4d44-a644-fad4548f0ca3","user_id":"1156369b-af42-4b08-9d56-b23e6fa8d688","created_at":"2023-12-16T18:14:27.701Z","text":"lalala","likes":0}]}
```

## Read one post

... with missing UUID
```bash
curl -i localhost:3000/posts/54151537-d824-4194-b03a-a67e6adba915
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-/ECDUP+CNYgYGJ9/6aenG4dQQzY"
Date: Sat, 16 Dec 2023 18:47:45 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

... with existing UUID
```bash
curl localhost:3000/posts/23d3f38a-2301-43b6-a2ac-9b97c2bd1092
{"data":{"id":"23d3f38a-2301-43b6-a2ac-9b97c2bd1092","user_id":null,"created_at":"2023-12-16T18:14:18.197Z","text":"lalala","likes":0}}
```

## Delete existing post

```bash
curl -X DELETE localhost:3000/posts/23d3f38a-2301-43b6-a2ac-9b97c2bd1092
```

(returns 204 no content)
