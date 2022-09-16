import express from 'express'
import { read, write } from './utils/model.js'
import router from './routers/router.js'

const app = express()

app.use(express.json())
app.use(router)


app.listen(4000, () => console.log('ready http://localhost:4000'))