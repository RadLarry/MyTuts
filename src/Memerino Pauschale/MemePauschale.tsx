import React from "react";
import "./MemeCss.css";
import {Link} from "react-router-dom";

interface Memeprops {
    searchtype: string
    whatinfo: string

    happyChangeFunction: (d: string) => void

    valuee: string
    someRandomOptionalProp?: string  | undefined
}

interface InputState {
    valuee: string
    propValue: string
}

class Inputfield extends React.Component<Memeprops,InputState> {
    inputtype: any;
    iptype: any;

    constructor(props: Memeprops) {
        super(props);
        this.state = {
            valuee: props.valuee,
            propValue: props.valuee
        }
    }



    // nur update bei neuerer prop
    static getDerivedStateFromProps(props: Memeprops, state: InputState) {
        if(props.valuee !== state.propValue) {
            return {
                ...state,
                valuee: props.valuee,
                propValue: props.valuee
            }
        }
        return state
    }
/*
    fertig(e: any) {
        if (e.key === "Enter") {
            let temp = this.props.whatinfo;
            this.setState({...this.state, [temp]: this.state.input});
            console.log(this.state);

        }
    }

 */

    render() {
        if(this.props.someRandomOptionalProp !== undefined) {

        }
        return (
            <div>
                <input type={this.props.searchtype}
                       onChange={(e) => {
                           // this.props.happyChangeFunction(e.target.value)
                           this.setState({...this.state, valuee: e.target.value})
                       }}
                       onKeyDown={(e) => {
                           if(e.key === 'Enter') {
                               this.props.happyChangeFunction(this.state.valuee)
                           }
                       }
                       }
                       value={this.state.valuee}
                />
                Ergebniss: {this.state.valuee}
            </div>
        );
    }
}
// value feld egal=?
interface State {
    input: string
    output: string
    name: string
    nachname: string
    nummer: string
}

// was sind dann probs für ein interface?
export default class MemePauschale extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            input: "",
            output: "",
            name: "",
            nachname: "",
            nummer: "",

        }
    }


    render() {
        const state = this.state.name;
        const propsToDeliver = (key: 'name' | 'nachname' | 'nummer') => ({
            searchtype: 'text',
            whatinfo: key,
            happyChangeFunction: (v: string) => this.setState({...this.state, [key]: v}),
            valuee: this.state[key]
        })

        return (

            <div className="body">
                <Link to="/">
                    <button className="buttons">Back to main</button>
                </Link>
                <legend> Bitte gib dein Namen ein</legend>
                <button onClick={() => this.setState({...this.state, name: 'pipapo'})}>asdf</button>
                <Inputfield searchtype="text"
                            whatinfo="name"
                            happyChangeFunction={(v) => this.setState({...this.state, name: v})}
                            valuee={this.state.name}
                />
                <legend> Bitte gib dein Nachnamen ein</legend>
                <Inputfield {...propsToDeliver('nachname')}/>
                <legend> Bitte gib dein Alter ein</legend>
                <Inputfield searchtype="number"
                            whatinfo="nummer"
                            happyChangeFunction={(v) => this.setState({...this.state, nummer: v})}
                            valuee= {this.state.nummer}

                />
                Nummer:{JSON.stringify(this.state)}
                <br/>
            </div>
        )

    }
}
/* stat von memepauschale != inputfield? wie kriege ich die daten unten rein
/// wieso brauche ich den 2nd call für den richtigen state?
// button in den main bereich
was sind dann probs für ein interface?
wieso darf ich nicht Nummer{this.state} verwenden innerhalb des rendersß

*/
