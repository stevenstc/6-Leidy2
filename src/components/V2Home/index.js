import React, { Component } from "react";

import CrowdFunding from "../CrowdFunding";
import Oficina from "../Oficina";
import Datos from "../Datos";
import Depositos from "../Depositos";

export default class Home extends Component {
  
  render() {

      return (
        <>
          
          <div>
            <div>
              <section id="why-us" className="wow fadeIn mt-5">
                <div className="container">
                  <header className="section-header">
                      <h3>Make your investment</h3>
                  </header>
                  <div  className="row row-eq-height justify-content-center">
                    <CrowdFunding />
                  </div>
                  <div >
                  <Datos admin={this.props.admin}/>
                  </div>
                </div>
              </section>

              <section id="services" className="section-bg">
                <Oficina />
                <hr></hr>
                <Depositos />
              </section>
            </div>
          </div>
        </>
      );
  }
}
