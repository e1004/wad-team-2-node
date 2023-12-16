# wad-team-2-node
wad team 2 back end

# Endpoint demos

## Create a new post

curl -i -X POST localhost:3000/posts -d '{"authorName": "nimi", "authorEmail": "email", "text": "lalala"}' -H "Content-Type: application/json"

## Read all posts

curl localhost:3000/posts
{"data":[{"id":"23d3f38a-2301-43b6-a2ac-9b97c2bd1092","author_name":"nim345i","author_email":"email","created_at":"2023-12-16T18:14:18.197Z","text":"lalala","likes":0},{"id":"22c2bc0f-1344-4d44-a644-fad4548f0ca3","author_name":"nimi","author_email":"email","created_at":"2023-12-16T18:14:27.701Z","text":"lalala","likes":0}]}
