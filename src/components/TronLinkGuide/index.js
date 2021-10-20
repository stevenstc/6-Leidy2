import React from 'react';

import TronLinkLogo from './TronLinkLogo.png';


const WEBSTORE_URL = 'https://chrome.google.com/webstore/detail/ibnejdfjmmkpcnlpebklmnkoeoihofec/';

const logo = (
    <div className='col-sm-4 text-center'>
        <img src={ TronLinkLogo } className="img-fluid" alt='TronLink logo' />
    </div>
);

const openTronLink = () => {
    window.open(WEBSTORE_URL, '_blank');
};

const TronLinkGuide = props => {
    const {
        installed = false
    } = props;

    var link = window.location.href;

    if(!installed) {
        return (
            <div className='row' onClick={ openTronLink } style={{'paddingTop': '7em','color': 'black','textDecoration': 'none'}}>
                <div className='col-sm-8 bg-secondary text-white'>
                    <h1>Install TronLink</h1>
                    <p>
                        To create a post or tip others you must install TronLink. TronLink is a wallet of TRON that you can download at <a href={ WEBSTORE_URL } target='_blank' rel='noopener noreferrer'>Chrome Webstore</a>.
                        Once installed, go back and refresh the page.
                    </p>
                </div>
                { logo }
            </div>
        );
    }

    return (
    <> <a href={link}>

        <div className='tronLink row' style={{'paddingTop': '7em','color': 'black','textDecoration': 'none'}}>

            <div className='info col-sm-8 bg-secondary text-white'>
                <h1>Requires Login</h1>
                <p>
                    TronLink is installed but log in first. Open Tronlink in the browser bar and configure your first wallet or unlock an already created wallet.
                </p>
            </div>
            { logo }
        </div>
        </a>
    </>
    );
};

export default TronLinkGuide;
