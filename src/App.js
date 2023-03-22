
import './App.css';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

    function Profile() {
      const { address, isConnected } = useAccount()
      const { connect } = useConnect({
      connector: new InjectedConnector(),
      })
      const { disconnect } = useDisconnect()
     
      if (isConnected)
      return (
      <div>
      Connected to
       <div>{address}</div>
      </div>
      )
      return <button onClick={() => connect()}>Connect Wallet</button>
     }

export default Profile;
