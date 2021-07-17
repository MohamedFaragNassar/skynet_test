import Main from "./components/Main";
import { SkynetClient } from "skynet-js";
import { useEffect, useState } from "react";

const portal =
window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;

// Initiate the SkynetClient
const client = new SkynetClient(portal);


function App() {
    
    const [loading, setLoading] = useState(false);
    const [dataKey, setDataKey] = useState('');
    const [filePath, setFilePath] = useState();
    const [userID, setUserID] = useState();
    const [mySky, setMySky] = useState();
    const [loggedIn, setLoggedIn] = useState();
  
    const dataDomain = 'localhost';

    // When dataKey changes, update FilePath state.
    useEffect(() => {
      setFilePath(dataDomain + '/' + dataKey);
    }, [dataKey]);
  

    useEffect(() => {
        ( async ()=> {
          try {
            const mySky = await client.loadMySky(dataDomain);
            const loggedIn = await mySky.checkLogin();
        
            setMySky(mySky);
            setLoggedIn(loggedIn);
            if (loggedIn) {
              setUserID(await mySky.userID());
            }
          } catch (e) {
            console.error(e);
          }
        })()
        
    }, []);
  
    const handleMySkyLogin = async () => {
      const status = await mySky.requestLoginAccess();
      setLoggedIn(status);
      if (status) {
        setUserID(await mySky.userID());
        setDataKey(mySky.userID())
        window.location.reload()
      }
  
    
    };
  
    const handleMySkyLogout = async () => {
      await mySky.logout();
      setLoggedIn(false);
      setUserID('');
  
  
    };
  
    const handleMySkyWrite = async (jsonData) => {
      try {
        console.log(jsonData)
        await mySky.setJSON(filePath, jsonData);
      } catch (error) {
        console.log(`error with setJSON: ${error.message}`);
      }
    }
  
    const loadData = async (handler) => {
      setLoading(true);
      try{
        const { data, dataLink } = await mySky.getJSON(filePath);
        if(data?.data?.length > 0){
          console.log("lllllllllllllllll")
          handler(data?.data)
        }
        
      }catch(err){
        console.log(err)
      }
      setLoading(false);
    };
  
  const mainProps = {
      handleMySkyLogout,
      handleMySkyWrite,
      loadData,
      loading,
    }

  return (
    <div className="w-full flex items-start justify-center min-h-screen ">
        {loggedIn === true ? <Main {...mainProps} /> 
        : loggedIn === false ? 
          <div className = "w-full h-screen flex items-center justify-center" >
              <button className="px-6 py-4 rounded-md border shadow-md  font-semibold" 
              style={{background:"#FCE0A2"}} onClick={handleMySkyLogin}>
                Login with MySky
              </button>
          </div>
          :
          <div className="w-full h-screen flex items-center justify-center">
              <span className="px-6 py-4 rounded-md shadow-md bg-gray-200">Loading MySky...</span>
          </div>
        }
    </div>
  );
}

export default App;
