import React from "react";
import "./gamestyle.css";



class Box extends React.Component<{key:number,name:string, pointfnct: (e:React.MouseEvent<HTMLButtonElement>,i:number) => void, points:number}, {}>{



    render() {
        return (
            <div className={"Krams"}>

                <button   className={"Kramsbg"} onClick={(e:React.MouseEvent<HTMLButtonElement>)=> this.props.pointfnct(e,1)}> {this.props.name + ":\n"+this.props.points }</button>

                <button  className={"smallbutton"} onClick={(e) => this.props.pointfnct(e,5)}>+5</button>
                <button  className={"smallbutton"} style={{marginLeft:0}} onClick={(e) => this.props.pointfnct(e,10)}>+10</button>

            </div>
        );
    }
}

export class PlayerField extends React.Component<{}, {ActivePlayer:[{name:string,points:number}]}>{
    constructor(props:any) {
        super(props);
        //this.addplayer = this.addplayer.bind(this);
        this.state ={
            ActivePlayer:[
                {
                    name: '34',
                    points: 1234
                }
            ]

        }

    }


    addplayer(e:any){
        let name:any = window.prompt("name")
        //@ts-ignore
  //   this.state.ActivePlayer.push(<Box allpoints = {(e) => console.log(this.state)} key={name} name={name}/>)       // ! JS non-null assertion operator, sicher gehen dass nicht null
   //     this.setState( (prevstate) => ({ActivePlayer:[...prevstate.ActivePlayer, {name:name, points: 0}]}) )
        this.setState({...this.state,ActivePlayer:[...this.state.ActivePlayer,{name:name,points:0}]} )
        console.log(this.state.ActivePlayer)
   // this.props.ActivePlayer.append(<Box name="qwe"/>)

// {(e:any) => this.setState({...this.state,points:this.points + 10})}
}


    render() {
        //@ts-ignore
        const players:React.ReactElement[] = [];
        const NumberRegex = new RegExp("^[0-9]+$");
        return (
            <div>
                <br/>
                <legend>Add X to all <input

                    onKeyDown={ (e:any) =>{
                    {if (e.key === "Enter" && NumberRegex.test(e.target.value) )
                    {   let InputValue = e.target.value as number;
                        let StateCopy = {...this.state};


                        let ModifiedStateCopy = StateCopy.ActivePlayer.map(
                            (state,index) =>{
                                state.points = state.points + Number(InputValue);

                            }
                        )
                        console.log({ModifiedStateCopy})
                        //@ts-ignore
                        this.setState({...this.state})



                    }
                    if (e.key === "Enter") {

                        if (!NumberRegex.test(e.target.value)){
                            e.target.value = "nur nummern";
                             setTimeout(
                                 () => {
                                     e.target.value = "";

                                     e.style = {"background" :"red"}
                                 },1000
                             );

                        }
                    }
                    }


                    }}

                /> </legend>


                <button id= "button1" onClick={
                    (e) =>
                    this.addplayer(e)}>Add Player</button>

              <div>
                  { this.state.ActivePlayer.map( (p,i) => ( <Box

                                                                    pointfnct= {(e,amount) =>{

                                                                        p.points = p.points + amount;
                                                                        this.setState({...this.state});
                                                                        }
                                                                    }

                                                                points = {p.points}
                                                                    key={i} name={p.name}/>)

                  )

                  }
                  </div>


            </div>
        );
    }

}


// {players.map((p,i ) => <Box player={p}
//                                               changePlayer={(p) =>
//                                                   this.setState({...this.state, ActivePlayer: state.ActivePlayer.map((p2, i2) =>
//                                                       if i2==i return p2 else return p})} />)}
/*
wenn ich f12 auf habe und dann viele player habe gehen die buttons ncit, wtf?

 <button onClick={
                    () => console.log(this.state)
                }>qwewq</button>


                       //@ts-ignore
                                                                        let tempstate = {...this.state};
                                                                        //@ts-ignore
                                                                        let ts2 = {...tempstate.ActivePlayer[i]};
                                                                        ts2.name = p.name;
                                                                        ts2.points  = ts2.points + amount;
                                                                        //@ts-ignore
                                                                        tempstate[i] = ts2;
                                                                        //@ts-ignore
                                                                        console.log(tempstate[i]);
                                                                        console.log(p);


 */