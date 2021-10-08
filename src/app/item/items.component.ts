import { Component, OnInit } from '@angular/core'


import  {  WatchOSConnector  }  from  'nativescript-watchos-connector'
@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  connectedMessage = "Initializing";
  errorMessage="No Error";
  intValue=0;
  constructor(private _watchOSConnector: WatchOSConnector){}

  ngOnInit(): void {
    this._watchOSConnector.createWCSession();
    
    this.connectedMessage = this._watchOSConnector.watchOSChecker()?"watch connected":"Not Connected";
  }
  sendMessage(): void {
    try{
      this.connectedMessage = this._watchOSConnector.watchOSChecker()?"watch connected":"Not Connected";
      if(this._watchOSConnector.watchOSChecker()){
        this._watchOSConnector.checkActivation();

        let intValue =  this._watchOSConnector.convertInt(++this.intValue)
        let numberObject =  {
          convertedInt: intValue
        }

        this._watchOSConnector.sendObjectToWatch('numberObjectKey', numberObject);
      }
    }catch(ex){
      this.errorMessage = JSON.parse(ex);
    }

  }
}
