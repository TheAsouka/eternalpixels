import { ethers } from 'ethers'
import logo from './logo.svg';

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
                <h1 >Ethernal Pixels</h1>

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
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navigation;