// type warning = $localize`warning`;

// import { type } from "os";

// type MessageType = 'warning' | 'error';
// enum MessageHeader{ oops='Oops!' , ohNo= 'Oh no!' ,unsupported =  'Unsupported!'};
// export type MessageText =
//   | 'Pss! Our server is sleeping now. Please come back later.'
//   | 'Sorry, the data we have accumulated is not enough to build a route between the indicated cities. Try changing your request.'
//   | 'Sorry, we did not have time to adapt our application for the type of web browser you are using. But we managed to optimize it for Google Chrome ver. 86 or newest. We recommend trying it!';
// type MessageButton = 'Close' | 'Back' | 'Download';

export class AlertMessage {
  constructor(
    public type: string,
    public  header: string,
    public text: string,
    public buttons: Button[],
  ) {}

 
}
export class Button {
  constructor(
    public buttonType:string,
    public buttonText:string
  ) {}

}
