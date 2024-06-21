import { Request, Response, Router } from 'express'
import { getGames, insertGame, insertPlayer } from '../mongo';
import { SimpleGame } from '../data/simpleGame';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  console.log("Getting games...")

  try {
    const games = await getGames()
    res.status(200).json(games)
  } catch(error) {
    console.error("Error getting games: " + error)
    res.status(500).send("Error getting games")

  }
})

router.post('/create', async (req: Request, res: Response) => {
  console.log("Creating game...")

  try {
    const game: SimpleGame = req.body
    console.log("Inserting game ", game)

    const result = await insertGame(game)
    if (result.alreadyExists) res.status(200).send("Game already exists")
    else res.status(201).send("Game created")
  } catch(error) {
    console.error("Error creating game: " + error)
    res.status(500).send("Error creating game")
  }
})

export default router;