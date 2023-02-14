import React from 'react';
import "./ColorCoding.css"


class Textbox extends React.Component<any, any>{
    constructor(props:any) {
        super(props);
        this.textinput = this.textinput.bind(this);// fixt das probolem dass er decode text aufrufen kann
        this.decodeText= this.decodeText.bind(this);
        this.texttohtml = this.texttohtml.bind(this);
    }


    texttohtml(text:string[]){
       let a:any = document.getElementById("App");
        return (
            <div>
                 {a.outerHTML = a.outerHTML + text}
            </div>

        )
    }
// hallo *wie* geht *es* dir
    // alternative durch toHTML dann immer durh if abfrage pushen mit div container...
    decodeText(text:any) {
        //fettgedruckt durch *xxxxxx*
        text.replace(/\*(.*)\*/, '<span className="Fett">$1</span>')

        let splittext = text.split("*");
        let out = [];
        for (let i =0; i <= splittext.length;i++){
            if (i%2 !== 0){
                let temp:String = splittext[i];
                // wieso kann ich nicht im push splittext[i] nehmen?
                // wieso wird im loopt temp = string(splitttxt[i]) zum [object][object] aber der else push bleibt string?
                out.push('<div className="Fett">' + splittext[i] + '</div> ');
            }
            else{
        out.push(splittext[i]);
            }
        }
        this.texttohtml(out);
       // console.log(out);
    }

    textinput(e:any){
        if (e.keyCode === 13) {
            let input:any = e.target.value;
            e.target.value = "";
            // @ts-ignore           fix das noch xD
            const box = document.getElementById("InputBox");
            //@ts-ignore
            box.placeholder = "No more :((";
            //@ts-ignore
            this.decodeText(input);
        }
    }

    render() {
        return (
            <div className="Container">
                <input onKeyUp={this.textinput} placeholder="Text hier rein..." id="InputBox" type="text"/>
            </div>
        );
    }
}



export class Newtext extends React.Component<any, any> {

    render(){
        return (
            <div>
                <Textbox />
            </div>


        );
    }
}

