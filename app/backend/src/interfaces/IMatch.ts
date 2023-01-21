export interface IMatch {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

export interface ICreateMatch {
  homeTeamId: number,
  awayTeamId: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
}

// export interface FullMatch extends Match {
//   homeTeam: {
//     teamName: string
//   },
//   awayTeam: {
//     teamName: string
//   }
// }
