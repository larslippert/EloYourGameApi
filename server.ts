import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

import { testMongo } from './mongo';
import playersRouter from './routes/players';
import gamesRouter from './routes/games';

const PORT = process.env.PORT || 3000

// Welcome
console.log("Hello and welcome to Elo Your Game!");
testMongo();

app.get('/_health', (req, res) => {
	res.status(200).send('OK')
})

app.use('/api/players', playersRouter)
app.use('/api/games', gamesRouter)

app.listen(PORT, () => {
	console.info('Server started on port: ' + PORT)
})