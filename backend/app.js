const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.json([
    {
      "id":"1",
      "title":"Movie Review: The Perk of Being a Wallflower"
    },
    {
      "id":"2",
      "title":"Game Review: Need for Speed"
    },
    {
      "id":"3",
      "title":"Show Review: Looking for Alaska"
    }
  ])
})

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})