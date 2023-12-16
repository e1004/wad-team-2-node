# wad-team-2-node
wad team 2 back end

# Endpoint demos

## Create a new post

curl -i -X POST localhost:3000/posts -d '{"authorName": "nimi", "authorEmail": "email", "text": "lalala"}' -H "Content-Type: application/json"
