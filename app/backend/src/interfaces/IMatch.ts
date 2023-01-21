export interface Match {
  id: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
}

// export interface FullMatch extends Match {
//   homeTeam: {
//     teamName: string
//   },
//   awayTeam: {
//     teamName: string
//   }
// }
