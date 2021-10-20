import React, { Component } from "react";
import Select from 'react-select'
import Utils from "../../utils";

import cons from "../../cons.js";

export default class CrowdFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {

      min: 100,
      deposito: "Loading...",
      balance: "Loading...",
      accountAddress: "Loading...",
      porcentaje: "Loading...",
      dias: "Loading...",
      partner: "Loading...",
      balanceTRX: "Loading...",
      balanceUSDT: "Loading...",
      precioSITE: 1,
      valueUSDT: 0,
      hand: 0

    };

    this.deposit = this.deposit.bind(this);
    this.estado = this.estado.bind(this);
    this.estado2 = this.estado2.bind(this);

    this.rateSITE = this.rateSITE.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);
  }

  handleChangeUSDT(event) {
    //console.log(event)
    this.setState({valueUSDT: event.value});
  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, this.props.contractAddress);
    this.estado();
    setInterval(() => this.estado(),3*1000);
    setInterval(() => this.estado2(),3*1000);
  };

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

  async estado(){
    var accountAddress =  window.tronWeb.defaultAddress.base58;
    var inversors = await Utils.contract.investors(accountAddress).call();

    var options = [];

    var datos = {};

    inversors.inicio = 1000;

    var direccioncontract = await Utils.contract.tokenPricipal().call();

    var contractSITE = await window.tronWeb.contract().at(direccioncontract);
    var aprovado = await contractSITE.allowance(accountAddress,this.props.contractAddress).call();
    
    //aprovado = parseInt(aprovado._hex);
    if(aprovado.remaining){
      aprovado = parseInt(aprovado.remaining._hex);
    }else{
      aprovado = parseInt(aprovado._hex);
    }
    

    if (aprovado > 0) {

      var top = await Utils.contract.plansLength().call();

      for (let index = 0; index < top; index++) {
        var precio = await Utils.contract.plans(index).call();
        var active = await Utils.contract.active(index).call();
        precio = parseInt(precio)/10**6;
        if( precio > 0 && active && inversors.registered){
          datos = {};
          datos.value = index;
          datos.label = precio+' USDT';
          options[index] = datos;

        }
        
        
      }
    }

    this.setState({
      options: options
    });

  }

  async estado2(){

    var accountAddress =  window.tronWeb.defaultAddress.base58;
    var inversors = await Utils.contract.investors(accountAddress).call();

    var inicio = accountAddress.substr(0,4);
    var fin = accountAddress.substr(-4);

    var texto = inicio+"..."+fin;

    document.getElementById("contract").innerHTML = '<a href="https://tronscan.org/#/contract/'+this.props.contractAddress+'/code">Contract V '+this.props.version+'</a>';
    document.getElementById("login").href = `https://tronscan.io/#/address/${accountAddress}`;
    document.getElementById("login-my-wallet").innerHTML = texto;

    var direccioncontract = await Utils.contract.tokenPricipal().call();
    
    var contractSITE = await window.tronWeb.contract().at(direccioncontract);

    var nameToken1 = await contractSITE.symbol().call();

    //console.log(nameToken1);

    var aprovado = await contractSITE.allowance(accountAddress,this.props.contractAddress).call();
    //console.log(aprovado);

    if(aprovado.remaining){
      aprovado = parseInt(aprovado.remaining._hex);
    }else{
      aprovado = parseInt(aprovado._hex);
    }

    //console.log(aprovado);

    if (aprovado > 0) {
      if(!inversors.registered){
        aprovado = "Register";
      }else{
        aprovado = "Buy Plan";
      }
      
    }else{
      aprovado = "Allow wallet";
    }

    inversors.inicio = 1000;
    
    var tiempo = await Utils.contract.tiempo().call();
    tiempo = parseInt(tiempo._hex)*1000;

    var porcentiempo = ((Date.now()-inversors.inicio)*100)/tiempo;

    var decimales = await contractSITE.decimals().call();

    var balance = await contractSITE.balanceOf(accountAddress).call();
    balance = parseInt(balance._hex)/10**decimales;

    var valorPlan = 0;

    if( porcentiempo < 100 ){
      aprovado = "Update Plan";

      valorPlan = inversors.plan/10**8;
      
    }

    var partner = cons.WS;

    var hand = "Left ";

    if ( inversors.registered ) {
      partner = window.tronWeb.address.fromHex(await Utils.contract.padre(accountAddress).call());
    }else{

      var loc = document.location.href;
      if(loc.indexOf('?')>0){
          var getString = loc.split('?');
          getString = getString[getString.length-1];
          //console.log(getString);
          var GET = getString.split('&');
          var get = {};
          for(var i = 0, l = GET.length; i < l; i++){
              var tmp = GET[i].split('=');
              get[tmp[0]] = unescape(decodeURI(tmp[1]));
          }

          if (get['hand']){
            tmp = get['hand'].split('#');

            //console.log(tmp);

            if (tmp[0] === "right") {
              hand = "Rigth ";
            }
          }

          if (get['ref']) {
            tmp = get['ref'].split('#');

            //console.log(tmp[0]);

            var wallet = await Utils.contract.idToAddress(tmp[0]).call();
            wallet = window.tronWeb.address.fromHex(wallet);

            inversors = await Utils.contract.investors(wallet).call();

            if ( inversors.registered ) {
              partner = "team "+hand+" of "+wallet;
            }
          }

          
      }

    }

    if(partner === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"){
      partner = "---------------------------------";
    }
    

    var dias = 365;//await Utils.contract.tiempo().call();

    //var velocidad = await Utils.contract.velocidad().call();

    //dias = (parseInt(dias)/86400)*velocidad;

    var porcentaje = await Utils.contract.porcent().call();

    porcentaje = parseInt(porcentaje);

    var balanceTRX = await window.tronWeb.trx.getBalance();
    balanceTRX = balanceTRX/10**6;

    var direccioncontract2 = await Utils.contract.tokenPago().call();  
    //var direccioncontract2 = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";// USDT contrato o secundario

    var contractUSDT = await window.tronWeb.contract().at(direccioncontract2);
    var nameToken2 = await contractUSDT.symbol().call();
    var decimals = await contractUSDT.decimals().call();

    var balanceUSDT = await contractUSDT.balanceOf(accountAddress).call();

    balanceUSDT = parseInt(balanceUSDT)/10**decimals;

    this.setState({
      deposito: aprovado,
      balance: valorPlan,
      decimales: decimales,
      accountAddress: accountAddress,
      porcentaje: porcentaje,
      dias: dias,
      partner: partner,
      balanceSite: balance,
      balanceTRX: balanceTRX,
      balanceUSDT: balanceUSDT,
      nameToken1: nameToken1,
      nameToken2: nameToken2
    });
  }


  async deposit() {

    var { balanceSite, balanceTRX, valueUSDT , balance} = this.state;

    var accountAddress =  window.tronWeb.defaultAddress.base58;

    var tronUSDT = await window.tronWeb;
    var direccioncontract = await Utils.contract.tokenPricipal().call();
    var contractUSDT = await tronUSDT.contract().at(direccioncontract);
    var aprovado = await contractUSDT.allowance(accountAddress,this.props.contractAddress).call();

    aprovado = parseInt(aprovado.remaining._hex);
    //aprovado = parseInt(aprovado._hex);

    if (aprovado <= 0 && balanceTRX >= 50){
      await contractUSDT.approve(this.props.contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send();
      window.alert("Balance approval for exchange: successful");
      return;
    }

    var amount = await Utils.contract.plans(valueUSDT).call();
    amount = parseInt(amount._hex)/10**8;
    amount = amount-balance;
    amount = amount/this.state.precioSITE;

    if ( aprovado > 0 && 
      balanceSite >= amount && 
      balanceTRX >= 50 
      ){

        var loc = document.location.href;
        var sponsor = cons.WS;
        var hand = 0;
        var investors = await Utils.contract.investors(accountAddress).call();

        if (investors.registered) {

          sponsor = await Utils.contract.padre(accountAddress).call();

        }else{

          if(loc.indexOf('?')>0){
            var getString = loc.split('?');
            getString = getString[getString.length-1];
            //console.log(getString);
            var GET = getString.split('&');
            var get = {};
            for(var i = 0, l = GET.length; i < l; i++){
                var tmp = GET[i].split('=');
                get[tmp[0]] = unescape(decodeURI(tmp[1]));
            }

            if (get['hand']){
              
              tmp = get['hand'].split('#');
  
              if (tmp[0] === "right") {
                hand = 1;
              }
            }

            if (get['ref']) {
              tmp = get['ref'].split('#');

              var wallet = await Utils.contract.idToAddress(tmp[0]).call();
              wallet = window.tronWeb.address.fromHex(wallet);

              var padre = await Utils.contract.investors(wallet).call();

              if ( padre.registered ) {
                sponsor = wallet;
              }
            }

          }
          
        }

        if(!investors.registered){
          var reg = Utils.contract.registro(sponsor, hand).send()
          reg.then(() => window.alert("congratulation registration: successful"));
          return;
        }

        if(sponsor !== "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb" && investors.registered && await Utils.contract.active(valueUSDT).call()){
        
          var userWithdrable = await Utils.contract.withdrawable(accountAddress).call();
          userWithdrable = parseInt(userWithdrable._hex);
          var MIN_RETIRO = await Utils.contract.MIN_RETIRO().call();
          MIN_RETIRO = parseInt(MIN_RETIRO._hex);

          var despositos = await Utils.contract.depositos(accountAddress).call();

          console.log(despositos[0].length);

          if (userWithdrable > MIN_RETIRO ){
            window.alert("Va comprar plan de menor o igual valor debe retirar lo disponible para continuar.");
            if(window.confirm("¿Desea realizar el retiro de su disponible?.")){
              await Utils.contract.withdraw().send();
              var buy = Utils.contract.buyPlan(valueUSDT).send()
              buy.then(() => window.alert("Felicidades inversión exitosa"))
              .then(() => document.getElementById("services").scrollIntoView({block: "start", behavior: "smooth"}));
            }else{
              if(window.confirm("¿Desea ccontinuar sin hacer un retiro?, si lo hace se reinvertira el disponible en el sistema de forma automatica.")){
                buy = Utils.contract.buyPlan(valueUSDT).send();
                buy.then(() => window.alert("Felicidades inversión exitosa"))
              .then(() => document.getElementById("services").scrollIntoView({block: "start", behavior: "smooth"}));

              }else{
                return;
              }
            }
          
          }if (despositos[0].length === 0){
            buy = Utils.contract.buyPlan(valueUSDT).send();
            buy.then(() => window.alert("Felicidades inversión exitosa"))
            .then(() => document.getElementById("services").scrollIntoView({block: "start", behavior: "smooth"}));

          }
          
        }else{
          if (await Utils.contract.active(valueUSDT).call() === false) {
            window.alert("Please select an active plan");
          } else {
            window.alert("Please use referral link to buy a plan");
          }

          
        }
          
    }else{


      if ( balanceSite < amount ) {

        window.alert("You do not have enough balance, you need: "+amount+" USDT and in your wallet you have: "+balanceSite);
      }

      if (balanceTRX < 50) {
        window.alert("Your account must have at least 150 TRX to execute the transactions correctly");
  
      }

      
    }


  };

  render() {

    var {options} = this.state;

    var segundoToken = <></>;

    if (this.state.nameToken1 !== this.state.nameToken2) {
      segundoToken = <>{this.state.nameToken2}: <strong>{(this.state.balanceUSDT*1).toFixed(6)}</strong><br /></> ;
    }
    
    return (
      <div className="card wow bounceInUp text-center col-md-7" >
        <div className="card-body">
          <h5 className="card-title" id="contract" >Contract V {this.props.version}</h5>

          <table className="table borderless">
            <tbody>
            <tr>
              <td><i className="fa fa-check-circle-o text-success"></i>ROI </td><td>{this.state.porcentaje}%</td>
            </tr>
            <tr>
              <td><i className="fa fa-check-circle-o text-success"></i>Earn</td><td>{(this.state.porcentaje)-100}%</td>
            </tr>
            </tbody>
          </table>

          <div className="form-group">Wallet
          <p className="card-text">
            <strong>{this.state.accountAddress}</strong><br />
          </p>
          <p className="card-text ">
        
            {this.state.nameToken1}: <strong>{this.state.balanceSite}</strong> (${(this.state.balanceSite*this.state.precioSITE).toFixed(2)})<br />
            TRX: <strong>{(this.state.balanceTRX*1).toFixed(6)}</strong><br />
            {segundoToken}
          </p>

          <h4>Plan Staking</h4>
          <div className="input-group sm-3 text-center">
            <Select options={options}  onChange={this.handleChangeUSDT} className="form-control mb-20 h-auto" />
          </div>

            <p className="card-text">At least 150 TRX to make any transactions</p>
            <p className="card-text">Partner:<br />
            <strong>{this.state.partner}</strong></p>

            <button className="btn btn-lg btn-success" onClick={() => this.deposit()}>{this.state.deposito}</button>

          </div>

        </div>
      </div>


    );
  }
}
