import { Outlet } from "react-router-dom";
import './App.css'

function App() { 
  return (
    <div className="App">
      {/*It is used to render the pages and components based on the routes */}
      <Outlet />    
    </div>
  );
}

export default App
