import React, { Component } from "react";
import Utils from "../../utils";

export default class Datos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalInvestors: 0,
      totalInvested: 0,
      totalRefRewards: 0,
      precioSITE: 1,
      wallet: "",
      plan: 0,
      cantidad: 0,
      hand: 0
    };

    this.totalInvestors = this.totalInvestors.bind(this);
    this.rateSITE = this.rateSITE.bind(this);

    this.handleChangeWALLET = this.handleChangeWALLET.bind(this);
    this.handleChangePLAN = this.handleChangePLAN.bind(this);
    this.handleChangeHAND = this.handleChangeHAND.bind(this);
    this.handleChangeCANTIDAD = this.handleChangeCANTIDAD.bind(this);

    this.asignarPlan = this.asignarPlan.bind(this);

  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, this.props.contractAddress);
    setInterval(() => this.totalInvestors(),3*1000);
  };

  handleChangeWALLET(event) {
    console.log(event)
    this.setState({wallet: event.target.value});
  }

  handleChangePLAN(event) {
    this.setState({plan: event.target.value});
  }

  handleChangeHAND(event) {
    this.setState({plan: event.target.value});
  }

  handleChangeCANTIDAD(event) {
    this.setState({cantidad: event.target.value});
  }

  async rateSITE(){
    /*
    var proxyUrl = cons.proxy;
    var apiUrl = cons.PRE;
    var response;

    try {
      response = await fetch(proxyUrl+apiUrl);
    } catch (err) {
      console.log(err);
      return this.state.precioSITE;
    }

    var json = await response.json();

    this.setState({
      precioSITE: json.Data.precio
    });

    return json.Data.precio;*/
    return 1;

  };

  async totalInvestors() {

    //await this.rateSITE();

    let esto = await Utils.contract.setstate().call();

    var direccioncontract = await Utils.contract.tokenPago().call();
    var contractUSDT = await window.tronWeb.contract().at(direccioncontract);
    var decimales = await contractUSDT.decimals().call();
    //console.log(esto);
    this.setState({
      totalInvestors: parseInt(esto.Investors._hex),
      totalInvested: parseInt(esto.Invested._hex)/10**decimales,
      totalRefRewards: parseInt(esto.RefRewards._hex)/10**decimales

    });

  };

  async asignarPlan(){
    if(this.props.version <= 1){
      var transaccion = await Utils.contract.asignarPlan(this.state.wallet, this.state.plan).send();
    }else{
      transaccion = await Utils.contract.asignarPlan(this.state.wallet, this.state.plan).send();
    }
    alert("verifica la transaccion "+transaccion);
    setTimeout(window.open("https://tronscan.io/#/transaction/"+transaccion, "_blank"), 3000);
    this.setState({plan: 0});

  }

  render() {

    if (this.props.admin === true) {

      return (
        <div className="row counters">

          <div className="col-lg-4 col-12 text-center">
            <span data-toggle="counter-up">{this.state.totalInvestors}</span>
            <p>Inversores Globales</p>
          </div>

          <div className="col-lg-4 col-12 text-center">
            <span data-toggle="counter-up">{(this.state.totalInvested/this.state.precioSITE).toFixed(2)} USDT</span>
            <p>Invertido en Plataforma</p>
          </div>

          <div className="col-lg-4 col-12 text-center">
            <span data-toggle="counter-up">{(this.state.totalRefRewards/this.state.precioSITE).toFixed(2)} USDT</span>
            <p>Total Recompensas por Referidos</p>
          </div>

          <div className="col-lg-4 col-12 text-center">
            <input type="text" onChange={this.handleChangeWALLET} />
            <p>Wallet</p>
          </div>

          <div className="col-lg-4 col-12 text-center">
          <input type="number" onChange={this.handleChangeCANTIDAD} />
            
            <p><button type="button" className="btn btn-info d-block text-center mx-auto mt-1" onClick={async() => {
              var direccioncontract = await Utils.contract.tokenPago().call();
              var contractUSDT = await window.tronWeb.contract().at(direccioncontract);
              var transaccion = await contractUSDT.transfer(this.state.wallet, parseInt(this.state.cantidad*10**6)).send();
              alert("verifica la transaccion "+transaccion);
              setTimeout(window.open("https://tronscan.io/#/transaction/"+transaccion, "_blank"), 3000);
              this.setState({cantidad: 0});
              }}>Send Token</button></p>
          </div>

          <div className="col-lg-4 col-12 text-center">
            <input type="number" onChange={this.handleChangePLAN} />
            <p><button type="button" className="btn btn-info d-block text-center mx-auto mt-1" onClick={() => this.asignarPlan()}>Asignar plan</button></p>
          </div>

        </div>
      );
    }else{
      return(<></>);
    }
  }
}
