import React from "react";
import "./apistyle.css";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

interface matchcall{
    "match_id": number,
    "barracks_status_dire": number,
    "barracks_status_radiant": number,
    "chat":  [
        {}
    ],
    "cluster": number,
    "cosmetics": { },
    "dire_score": number,
    "draft_timings": [
        {}
    ],
    "duration": number,
    "engine": number,
    "first_blood_time": number,
    "game_mode": number,
    "human_players": number,
    "leagueid": number,
    "lobby_type": number,
    "match_seq_num": number,
    "negative_votes": number,
    "objectives": { },
    "picks_bans": { },
    "positive_votes": number,
    "radiant_gold_adv": { },
    "radiant_score": number,
    "radiant_win": true,
    "radiant_xp_adv": { },
    "start_time": number,
    "teamfights": { },
    "tower_status_dire": number,
    "tower_status_radiant": number,
    "version": number,
    "replay_salt": number,
    "series_id": number,
    "series_type": number,
    "radiant_team": { },
    "dire_team": { },
    "league": { },
    "skill": number,
    "players": string,
    "patch": number,
    "region": number,
    "all_word_counts": { },
    "my_word_counts": { },
    "throw": number,
    "comeback": number,
    "loss": number,
    "win": number,
    "replay_url": string

}

export default class Api extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        this.state={
            inputValue: "",
            error:null,
            isLoaded:false,
            items:[]
        };
    }
        // match 7016047049
apigo(){
        const domain = "https://api.opendota.com/api/matches/";
        const enddomain = domain + this.state.inputValue;
        console.log(enddomain)
        fetch(enddomain)
            .then((res) => res.json())
            .then((res) => this.setState({...this.state,items:[...this.state.items, res]}

                )

            )

        console.log(this.state.items.players);
       // global variable hierhin damit ich hier sagen kann was angezeigt wrden soll aus der json


}

    render() {
        return (
            <div>
                <legend>API</legend>
                <input type="text"
                       onChange={(e) => this.setState({...this.state,inputValue:e.target.value})}
                />
                <button onClick={(e) => this.apigo()}
                >
                    MatchID eingeben
                </button>
                <p id="results">Result:</p>

                <div className="results" dangerouslySetInnerHTML={{__html:this.state.items.map(
                        (e:any) => JSON.stringify(e)
                    )}} />
            </div>
        );                          // ?. für optinaal chain; wenn das hinter ? undefined ist dann wirds weg gelassen
    }
}       //     <div className="results" dangerouslySetInnerHTML={{__html:JSON.stringify(this.state.items[0]?.match_id)}} />


