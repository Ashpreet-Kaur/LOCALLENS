import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate=useNavigate();
  const handleNavigation=(path)=>{
    navigate(path);
  };
  return (
    <>
    <h1 style={{textAlign:'center', margin:"50px", fontSize:"150px"}}>🗺️</h1>
     <h1 style={{textAlign:"center", fontSize:"50px"}}><b>Oops! Page Not Found</b></h1>
     <p style={{textAlign:"center", marginBottom:"30px"}}>It looks like you've wandered off the map. The pages you're looking for doesn't exist or has been moved.</p>

  <div style={{
  textAlign: "center",
  boxShadow: "0 4px 8px 0 grey, 0 6px 20px 0 grey",
  width: "500px",
  margin: "auto",
  borderRadius: "10px",
  padding: "20px 0"  
}}>
  <h1 style={{ color: "black", fontSize: "20px", marginTop: "3px" ,marginBottom:"15px"}}>
    📍Where would you like to go?
  </h1>
  <button  onClick={()=>handleNavigation('/')} style={{marginRight:"10px",background:"white", border:" 2px solid blue",color:"blue"}}>🏠Home</button>
  <button onClick={()=>handleNavigation('/Explore')} style={{marginRight:"10px",background:"white", border:" 2px solid blue",color:"blue"}}>🕐 Explore Places</button>
  <button onClick={()=>handleNavigation('/Favourite')} style={{background:"white", border:" 2px solid blue",color:"blue",}}>⭐My Favorites</button>
</div>

     

     <p style={{textAlign:"center", margin:"30px"}}><b>Error Code:</b> 404 - Page Not Found</p>
    <button  onClick={() => navigate(-1)}  style={{ display: "block", margin: "30px auto",background:"white", border:" 2px solid blue",color:"blue" }}>
  ⬅️Go Back
</button>

   </>
  )
}

export default PageNotFound
