import React from "react";
import "./gamestyle.css";

class Box extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        this.state ={
            points:0
        }
    }



 newpoint(e:any,amount:number){
        this.setState({...this.state,points:this.state.points + amount})
 }
    render() {
        return (
            <div className={"Krams"}>
                <button  className={"Kramsbg"} onClick={(e)=> this.newpoint(e,1)}> {this.props.name + ":\n"+this.state.points }</button>
                <button  className={"smallbutton"} onClick={(e) => this.newpoint(e,5)}>+5</button>
                <button  className={"smallbutton"} style={{marginLeft:0}} onClick={(e) => this.newpoint(e,10)}>+10</button>
            </div>
        );
    }
}

export class PlayerField extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        //this.addplayer = this.addplayer.bind(this);
        this.state ={
            ActivePlayer:[]

        }

    }


    addplayer(e:any){
        let name = window.prompt("name")
     this.state.ActivePlayer.push(<Box name={name}/>)
        let temp = this.state.ActivePlayer;
        this.setState({...this.state, ActivePlayer:this.state.ActivePlayer })
   // this.props.ActivePlayer.append(<Box name="qwe"/>)
        console.log(this.state.ActivePlayer)

}


    render() {
        const players:any = [];
        this.state.ActivePlayer.forEach(
            (e:any) => players.push(e)

        )
        return (
            <div>
                <button id= "button1" onClick={
                    (e) =>
                    this.addplayer(e)}>Add Player</button>

              <div>{players}</div>


            </div>
        );
    }

}

/*
wenn ich f12 auf habe und dann viele player habe gehen die buttons ncit, wtf?

 <button onClick={
                    () => console.log(this.state)
                }>qwewq</button>
 */