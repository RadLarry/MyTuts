import React from 'react'
import './ColorCoding.css'
import {useHref} from "react-router-dom";



interface State {
    inputValue: string
    morphedTexts: string[]
}

export default class Irgendwas extends React.Component<any, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            inputValue: '',
            morphedTexts: ['initialValue']
        }
    }

    render() {


        return (
            <div>

                <input type={'text'}
                       value={this.state.inputValue}
                       onKeyDown={(e) => this.handleKeyDown(e)} // durch inline function brauch ich nicht bidnen
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                           const changedState = {...this.state, inputValue: e.target.value}     ///... macht kopie vom state; das Komma gibt an was dann anders ist
                           this.setState(changedState)
                           this.props.onDadidu(e)
                       }}
                />
                <button onClick={() => this.handleClick()}>
                    Submit
                </button>
                {
                    this.state.morphedTexts.map((text: string, index: number) => {
                        return (<div key={'text' + index}>
                            <div dangerouslySetInnerHTML={{__html: text}} style={{margin: 16}} />
                        </div>)
                    })
                }
            </div>
        );
    }


    private handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if(e.key === "Enter") {
            this.handleClick()
        }
    }

    private handleClick() {
        let value = this.state.inputValue;

        value = value.replace(/\x2A(.*)\x2A/g, '<span class="Fett">$1</span>');
        this.setState({
            ...this.state,
            morphedTexts: [...this.state.morphedTexts, value],
            inputValue: ""
        } )

    }
}