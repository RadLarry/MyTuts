import React from "react";
import "./MemeCss.css";

class Inputfield extends React.Component<any, any>{
    inputtype:any;
    iptype:any;
    constructor(props:any) {
        super(props);

    }

fertig(e:any){
        if (e.key ==="Enter"){
        let temp = this.props.whatinfo;
        this.setState({...this.state,[temp]:this.state.input});
        console.log(this.state);

        }
}
    render() {
        return (
            <div>
                <input type={this.props.searchtype}
                onChange={(e) => this.setState({...this.state, input:e.target.value})}
                onKeyDown={ (e) => this.fertig(e)
                }
                />
                Ergebniss: {this.state?.name||this.state?.nachname||this.state?.nummer}
            </div>
        );
    }
}


interface Memeprops{
    searchtype:string,
    whatinfo:string,

}
// was sind dann probs für ein interface?
export default class MemePauschale extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        this.state={
            input:"",
            output:"",
            name:"",
            nachname:"",
            nummer:"",

        }
    }



    render(){
        const state = this.state.name;
        return(

            <div className="body">
                <legend> Bitte gib dein Namen ein</legend>
                <Inputfield searchtype = "text"
                            whatinfo ="name"


                />
                <legend> Bitte gib dein Nachnamen ein</legend>
                <Inputfield searchtype = "text"
                            whatinfo ="nachname"
                />
                <legend> Bitte gib dein Alter ein</legend>
                <Inputfield searchtype = "number"
                            whatinfo ="nummer"/>

                Nummer:{state}

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
