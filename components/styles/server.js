const next = require('next')
const http = require('http')

const dev = false
const app = next({ dev })
const handle = app.getRequestHandler()

const port = process.env.PORT

app.prepare().then(() => {
  http.createServer((req, res) => {
    handle(req, res)
  }).listen(port, () => {
    console.log("Next.js running on port " + port)
  })
})
