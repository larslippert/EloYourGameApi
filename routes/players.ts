import { Request, Response, Router } from 'express'
import { SimplePlayer } from '../data/simplePlayer';
import { insertPlayer } from '../mongo';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello from players')
})

router.post('/create', async (req: Request, res: Response) => {
  console.log("Creating player...")

  try {
    const player: SimplePlayer = req.body.player
    const gameId: String = req.body.gameId
    console.log("Inserting player ", player)
    console.log("For game ", gameId)

    await insertPlayer(player)
    res.status(201).send("Player created")
  } catch(error) {
    console.error("Error creating player: " + error)
    res.status(500).send("Error creating player")
  }
})

export default router;