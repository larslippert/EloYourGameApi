export type SimpleGame = {
  id: String,
  name: String,
  maxPlayersPerTeam: Number,
  keepScore: Boolean,
}

export type SimpleGameCreate = {
  name: String,
  maxPlayersPerTeam: Number,
  keepScore: Boolean,
}