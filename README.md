# wad-team-2-node
wad team 2 back end

# Endpoint demos

## Create a new post

```bash
curl -i -X POST localhost:3000/posts -d '{"authorName": "nimi", "authorEmail": "email", "text": "lalala"}' -H "Content-Type: application/json"
```

## Update existing post

```bash
curl -i -X PATCH localhost:3000/posts/0a290bc2-c8b2-4c4d-b89d-0713bd2b7799 -d '{"text": "ghhhhhh"}' -H "Content-Type: application/json"
{"data":{"id":"0a290bc2-c8b2-4c4d-b89d-0713bd2b7799","author_name":"nimi","author_email":"email","created_at":"2023-12-17T09:55:24.766Z","text":"ghhhhhh","likes":0}}
```

## Read all posts

```bash
curl localhost:3000/posts
{"data":[{"id":"23d3f38a-2301-43b6-a2ac-9b97c2bd1092","author_name":"nim345i","author_email":"email","created_at":"2023-12-16T18:14:18.197Z","text":"lalala","likes":0},{"id":"22c2bc0f-1344-4d44-a644-fad4548f0ca3","author_name":"nimi","author_email":"email","created_at":"2023-12-16T18:14:27.701Z","text":"lalala","likes":0}]}
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
{"data":{"id":"23d3f38a-2301-43b6-a2ac-9b97c2bd1092","author_name":"nim345i","author_email":"email","created_at":"2023-12-16T18:14:18.197Z","text":"lalala","likes":0}}
```

## Delete existing post

```bash
curl -X DELETE localhost:3000/posts/23d3f38a-2301-43b6-a2ac-9b97c2bd1092
```

(returns 204 no content)
