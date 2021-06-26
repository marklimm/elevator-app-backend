import express, { Application, Request, Response } from 'express'
import { createServer } from 'http'

import { initSocketIO } from './lib/socketIOSetup'

//  started to create this file following https://blog.logrocket.com/typescript-with-node-js-and-express/

const app: Application = express()
const httpServer = createServer(app)

const PORT = process.env.PORT || 8000

//  a regular API route
app.get('/', (req: Request, res: Response) => res.send(`Express + TypeScript Server is awesome!!! - ${new Date()}`))

httpServer.listen(PORT, () => {
  console.log(`server listening on *:${PORT}`)
})

//  setup the server-side socketio functions
initSocketIO(httpServer)
