import { useAppSelector } from "../store"
import { SingleEliminationBracket, Match } from "@g-loot/react-tournament-brackets"
import MenuBackground from "../components/MenuBackground"


export default function HighlightScreen() {
  const currentUser = useAppSelector(state => state.auth.currentUser)
  const sidebarStatus = useAppSelector(state => state.sidebar.status)


  return (
    <MenuBackground>
      
      {/* Header */}
      <div className="flex flex-row h-fit w-full justify-between items-end">
        <h1 className="font-quicksand text-white text-heading">Highlight</h1>
        <button className="flex flex-row gap-[12px] items-center h-fit w-fit">
          <h1 className="font-quicksand text-white hover:text-red-600 text-subheading">{currentUser?.name}</h1>
          <img className="rounded-full bg-cover bg-gray-500 w-[28px] h-[28px] outline-0"/>
        </button>
      </div>

      {/* Content - scrollable */}
      <div className="flex flex-col overflow-y-scroll">
        <SingleEliminationBracket 
          matches={[
            {
              "id": 260005,
              "name": "Final - Match",
              "nextMatchId": 260006, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
              "tournamentRoundText": "4", // Text for Round Header
              "startTime": "2021-05-30",
              "state": "DONE", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
              "participants": [
                {
                  "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
                  "resultText": "WON", // Any string works
                  "isWinner": false,
                  "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                  "name": "giacomo123"
                },
                {
                  "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
                  "resultText": "LOSE",
                  "isWinner": true,
                  "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
                  "name": "Ant"
                }
              ]
            },
            {
              "id": 260006,
              "name": "Final - Match",
              "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
              "tournamentRoundText": "4", // Text for Round Header
              "startTime": "2021-05-30",
              "state": "DONE", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
              "participants": [
                {
                  "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
                  "resultText": "WON", // Any string works
                  "isWinner": false,
                  "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                  "name": "giacomo123"
                },
                {
                  "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
                  "resultText": "LOSE",
                  "isWinner": true,
                  "status": "PLAYED", // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
                  "name": "Ant"
                }
              ]
            }
          ]}

          matchComponent={({ match, onMatchClick, onPartyClick, onMouseEnter, onMouseLeave, topParty, bottomParty, topWon, bottomWon, topHovered, bottomHovered, topText, bottomText, connectorColor, computedStyles, teamNameFallback, resultFallback }) => (
            <div className="flex flex-col space-around w-full h-fit gap-[12px] text-white font-quicksand">

              {/* Team A */}
              <div 
                onMouseEnter={() => onMouseEnter(topParty.id)} 
                className="flex flex-row bg-secondary-gradient rounded-full justify-between px-[16px] py-[4px] ">
                <div>{topParty.name || teamNameFallback}</div>
                <div>{topParty.resultText ?? resultFallback(topParty)}</div>
              </div>

              {/* Team B */}
              <div 
                onMouseEnter={() => onMouseEnter(bottomParty.id)} 
                className="flex flex-row bg-secondary-gradient rounded-full justify-between px-[16px] py-[4px] ">
                <div>{bottomParty.name || teamNameFallback}</div>
                <div>{bottomParty.resultText ?? resultFallback(topParty)}</div>
              </div>
            </div>
          )}

          options={{
            style: { 
              roundHeader: { isShown: false },
              connectorColor: "gray",
              connectorColorHighlight: "blue"
            } 
          }}
          />
      </div>
    </MenuBackground>
  )
}