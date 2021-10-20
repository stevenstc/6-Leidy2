import React, { Component } from "react";
import Utils from "../../utils";

export default class Depositos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direccion: "",
      link: "Make an investment to get the referral LINK",
      registered: false,
      balanceRef: 0,
      totalRef: 0,
      invested: 0,
      paidAt: 0,
      my: 0,
      almacen: 0,
      withdrawn: 0,
      precioSITE: 1,
      valueSITE: 0,
      valueUSDT: 0,
      personasIzquierda: 0,
      puntosIzquierda: 0,
      personasDerecha: 0,
      puntosDerecha: 0,
      bonusBinario: 0,
      puntosEfectivosIzquierda: 0,
      puntosEfectivosDerecha: 0,
      puntosReclamadosIzquierda: 0,
      puntosReclamadosDerecha: 0,
      puntosLostIzquierda: 0,
      puntosLostDerecha: 0,
      directos: 0,

    };

    this.Investors = this.Investors.bind(this);
    this.Investors2 = this.Investors2.bind(this);
    this.Investors3 = this.Investors3.bind(this);
    this.Link = this.Link.bind(this);
    this.withdraw = this.withdraw.bind(this);

    this.rateSITE = this.rateSITE.bind(this);
    this.handleChangeSITE = this.handleChangeSITE.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);
  }

  handleChangeSITE(event) {
    this.setState({valueSITE: event.target.value});
  }

  handleChangeUSDT(event) {
    this.setState({valueUSDT: event.target.value});
  }

  async componentDidMount() {
    await Utils.setContract(window.tronWeb, this.props.contractAddress);
    setInterval(() => this.Investors2(),3*1000);
    setInterval(() => this.Investors3(),3*1000);
    setInterval(() => this.Investors(),3*1000);
    setInterval(() => this.Link(),3*1000);
  };

  async rateSITE(){
    /*var proxyUrl = cons.proxy;
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

  async Link() {
    const {registered} = this.state;
    if(registered){

      let loc = document.location.href;
      if(loc.indexOf('?')>0){
        loc = loc.split('?')[0];
      }

      if(loc.indexOf('#')>0){
        loc = loc.split('#')[0];
      }
      let mydireccion = window.tronWeb.defaultAddress.base58;
      mydireccion = await Utils.contract.addressToId(mydireccion).call();
      mydireccion = loc+'?ref='+mydireccion;
      var link = mydireccion+"&hand=izq";
      var link2 = mydireccion+"&hand=der";
      this.setState({
        link: link,
        link2: link2,
      });
    }else{
      this.setState({
        link: "Make an investment to get the referral LINK",
        link2: "Make an investmentnto get the referral LINK",
      });
    }
  }


  async Investors() {

    let direccion = window.tronWeb.defaultAddress.base58;
    let usuario = await Utils.contract.investors(direccion).call();
    usuario.withdrawable = await Utils.contract.withdrawable(direccion).call();
    
    var tronUSDT = await window.tronWeb;
    var direccioncontract = await Utils.contract.tokenPricipal().call();
    var contractUSDT = await tronUSDT.contract().at(direccioncontract); 
    var decimales = await contractUSDT.decimals().call();

    var verdepositos = await Utils.contract.depositos(direccion).call();

    usuario.inicio = 1000;
    usuario.amount = parseInt(usuario.amount._hex);
    usuario.invested = parseInt(usuario.invested);
    usuario.withdrawn = parseInt(usuario.withdrawn._hex);
    usuario.directos = parseInt(usuario.directos);
    usuario.balanceRef = parseInt(usuario.balanceRef);
    usuario.almacen = parseInt(usuario.almacen);
    usuario.totalRef = parseInt(usuario.totalRef._hex);
    usuario.paidAt = parseInt(usuario.paidAt._hex);
    usuario.withdrawable = parseInt(usuario.withdrawable._hex);

    var listaDepositos = (
      <div className="box">
        <h3 className="title">There is not yet deposits.</h3>

      </div>
    );

    if (verdepositos[0].length > 0) {
      var depositos = await Utils.contract.depositos(direccion).call();
      depositos.amount =  depositos[0];
      delete depositos[0];
      depositos.tiempo =  depositos[1];
      delete depositos[1];
      depositos.pasivo =  depositos[2];
      delete depositos[2];
      depositos.activo =  depositos[3];
      delete depositos[3];

      //console.log(depositos);

      listaDepositos = [];

      var tiempo = await Utils.contract.tiempo().call();
      tiempo = parseInt(tiempo._hex)*1000;

      let porcent = await Utils.contract.porcent().call();
        porcent = parseInt(porcent._hex)/100;

      for (let i = 0; i < depositos.amount.length; i++) {

      
        //depositos.tiempo[i] = parseInt(depositos.tiempo[i]._hex);

        var porcentiempo = (((Date.now()-(parseInt(depositos.tiempo[i]._hex)*1000)))*100)/tiempo;


        var fecha = new Date((parseInt(depositos.tiempo[i]._hex)*1000)+tiempo);
        fecha = ""+fecha;

        var proceso;
        if (depositos.activo[i]  && ((parseInt(depositos.amount[i]._hex)/10**6)*(porcentiempo/100)) < (parseInt(depositos.amount[i]._hex)/10**6)) {
          if (depositos.pasivo[i]  ) {
            proceso = <b>Plan Binary (ACTIVE)</b> 
          } else {
            proceso = <b>Plan FREE Binary (ACTIVE)</b> 
          }
        }else{
          if (depositos.pasivo[i]  ) {
            proceso = <b>Plan Binario (FINALIZED)</b> 
          }else{
            proceso = <b>Plan FREE Binario (FINALIZED)</b> 
          }
        }
        

        listaDepositos[i] = (
          <div className="box" key={"depsits-"+i}>
          <h3 className="title">{(parseInt(depositos.amount[i]._hex)/10**6)/porcent} USDT</h3>
            Estimate time <b>{fecha}</b>
          <div className="progress" style={{"height": "20px"}}>
            <div className="progress-bar-striped progress-bar-animated bg-success" role="progressbar" style={{"width": porcentiempo+"%"}} aria-valuenow={this.state.porcentiempo} aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br></br>
          {proceso}
    
    
        </div>
        );
        
      }
    }

    //console.log(usuario);

    

    this.setState({
      direccion: window.tronWeb.address.fromHex(direccion.address),
      registered: usuario.registered,
      balanceRef: usuario.balanceRef/10**decimales,
      totalRef: usuario.totalRef/10**decimales,
      invested: usuario.invested/10**decimales,
      paidAt: usuario.paidAt/10**decimales,
      my: usuario.withdrawable/10**decimales,
      withdrawn: usuario.withdrawn/10**decimales,
      almacen: usuario.almacen/10**decimales,
      porcentiempo: porcentiempo,
      directos: usuario.directos,
      depositos: listaDepositos
    });

  };

  async Investors2() {

    //var precioSITE = await this.rateSITE();

    /*this.setState({
      precioSITE: precioSITE
    });*/

  };

  async Investors3() {

    var {balanceRef, my, almacen, directos, valorPlan } = this.state;

    let direccion = window.tronWeb.defaultAddress.base58;

    //Personas y puntos totales
    let puntos = await Utils.contract.personasBinary(direccion).call();

    // monto de bonus y puntos efectivos
    let bonusBinario = await Utils.contract.withdrawableBinary(direccion).call();
  
    var available = (balanceRef+my+almacen);

    if(directos >= 2 && available < valorPlan ){
      bonusBinario.amount = parseInt(bonusBinario.amount._hex)/10**6;
    }else{
      bonusBinario.amount = 0;
    }

    let brazoIzquierdo = await Utils.contract.handLeft(direccion).call();

    let brazoDerecho = await Utils.contract.handRigth(direccion).call();

    //console.log(brazoDerecho);

    this.setState({
      personasIzquierda: parseInt(puntos.pLeft._hex),
      personasDerecha: parseInt(puntos.pRigth._hex),

      puntosIzquierda: parseInt(puntos.left._hex)/10**6,
      puntosDerecha: parseInt(puntos.rigth._hex)/10**6,

      bonusBinario: bonusBinario.amount,

      puntosEfectivosIzquierda: parseInt(bonusBinario.left._hex)/10**6,
      puntosEfectivosDerecha: parseInt(bonusBinario.rigth._hex)/10**6,

      puntosReclamadosIzquierda: parseInt(brazoIzquierdo.reclamados._hex)/10**6,
      puntosReclamadosDerecha: parseInt(brazoDerecho.reclamados._hex)/10**6

    });

  };

  async withdraw(){
    const { balanceRef, my, almacen, directos, valorPlan, bonusBinario } = this.state;

    var available = (balanceRef+my+almacen);
    if(directos >= 2 && available < valorPlan){
      available += bonusBinario;
    }
    available = available.toFixed(8);
    available = parseFloat(available);

    var direccioncontract = await Utils.contract.tokenPricipal().call();
    var contractUSDT = await window.tronWeb.contract().at(direccioncontract);

    var decimales = await contractUSDT.decimals().call();

    var MIN_RETIRO = await Utils.contract.MIN_RETIRO().call();
    MIN_RETIRO = parseInt(MIN_RETIRO._hex)/10**decimales;

    if ( available > MIN_RETIRO ){
      await Utils.contract.withdrawToDeposit().send();
      await Utils.contract.withdraw().send();
    }else{
      if (available < MIN_RETIRO) {
        window.alert("The minimum to withdraw are: "+(MIN_RETIRO)+" USDT");
      }
    }
  };


  render() {   

    return (

      <div className="container">

        <header style={{'textAlign': 'center'}} className="section-header">
          <h3 className="white">
            <i className="fa fa-university mr-2" aria-hidden="true"></i>
            <span style={{'fontWeight': 'bold'}}>
              Deposits:
            </span>
          </h3>
          <div className="row text-center">
            <div className="col-md-12 col-lg-10 offset-lg-1 wow bounceInUp" data-wow-duration="1s">
              {this.state.depositos}
              
            </div>
          </div>


        </header>


      </div>

    );
  }
}
