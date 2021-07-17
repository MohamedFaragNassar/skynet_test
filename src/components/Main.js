import React, { useEffect, useState } from 'react'
import { SkynetClient } from "skynet-js";
import Spinner from './Spinner';
const client = new SkynetClient();


const Main = (props) => {
    const [item,setItem] = useState()
    
    const [data, setData] = useState([])

  
    const handleChangeComplete = (type,id) => {
        let updatedData
        if(type == "check"){
             updatedData = data.map(e => {
                if(e.id == id){
                    e.complete = true
                    return e
                }else{
                    return e
                }
            })
        }else{
            updatedData = data.map(e => {
                if(e.id == id){
                    e.complete = false
                    return e
                }else{
                    return e
                }
            })
        }
        
        props.handleMySkyWrite({data:updatedData})
        setData(updatedData)

    }

    const handleDelete = (id) => {
        const updatedData = data.filter(e => e.id != id) 
        setData(updatedData)
        props.handleMySkyWrite({data:updatedData})
    }

    const handleAddItem = (e) => {
        e.preventDefault()
        const newItem = {
            id:Math.random(),
            item:item,
            complete:false
        }
        props.handleMySkyWrite({data:[newItem,...data]})
        setData([newItem,...data])
        e.target.reset()
    }

    useEffect(() => {
        props.loadData(setData)
    }, [])

   

    return (
        <div className="w-5/6 md:w-3/5 lg:2/5 bg-white rounded-md shadow-lg mt-5 p-2 relative" 
        style={{height:95+"vh"}}>
            <button className="absolute top-2 right-2" onClick={props.handleMySkyLogout}>
                <img src="logout.png" className="w-8 h-8" />
            </button>
            <div className="w-full flex items-center justify-center">
                <img src="list.png"  />
                <h1 className="font-mono font-semibold text-2xl" style={{color:"#648B8E"}}>Todo List</h1>
            </div>
            <form onSubmit={(e)=>handleAddItem(e)} className="flex items-center justify-center w-full mt-4 mb-4 ">
                <input type="text" required={true} onChange={(e)=>setItem(e.target.value)} 
                className="w-5/6 h-10 p-2 border-l-2 border-t-2 border-b-2 rounded-l-md  " />
                <button type="submit" className="w-14 h-10 rounded-r-md text-2xl text-gray-600" 
                style={{background:"#FCE0A2"}}>+</button>
            </form>
            {props.loading ? <div className="w-full flex items-center justify-center"><Spinner /></div> : 
            <div className="w-full flex flex-col items-center p-4 h-5/6  overflow-auto">
                {data?.map(e => 
                    <div key={e.id} className="w-full flex items-center justify-between pt-2 pb-2 border-b">
                        <div className="w-11/12 flex items-center justify-start ">
                            {
                                e.complete ? 
                                    <button onClick={()=>handleChangeComplete("uncheck",e.id)}>
                                        <img  src="correct.png" className="w-10 h-10" />
                                    </button>
                                :
                                    <button onClick={()=>handleChangeComplete("check",e.id)}>
                                        <img src="circle.png" className="w-10 h-10" />
                                    </button>
                            }
                            <span className={`w-full font-mono ml-2 break-all ${ e.complete? "line-through" : "" }`} 
                            style={{color:e.complete?"#5EAAA8":"#008891"}}>
                                {e.item}
                            </span>
                        </div>
                        <button className="w-7 h-7" onClick={()=>handleDelete(e.id)}>
                            <img  src="delete.png" />
                        </button>
                    </div>    
                )}
            </div>}
        </div>
    )
}

export default Main
