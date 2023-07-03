import { ethers } from 'ethers'
import logo from '../style/logo.svg';
import foxlogo from '../style/MetaMask_Fox.png';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        //Interact with metamask -> fetch account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account)
        console.log(account)
    }

    return (
        <nav>
            <div className='App-header'>

                <img src={logo} className="App-logo" alt="logo" />
                <h1 >Eternal Pixels</h1>

                {account ? (
                    <button
                        type="button"
                        className='nav__connect'
                    >
                        {account.slice(0, 5) + '...' + account.slice(39, 42)}
                    </button>
                ) : (
                    <button
                        type="button"
                        className='nav__connect'
                        onClick={connectHandler}
                    >
                        Connect
                        <img src={foxlogo} alt="Foxlogo" className="nav__logo" />
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navigation;