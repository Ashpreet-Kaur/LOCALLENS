import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Fav from './pages/Fav'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'
import Register from './pages/Register'

import { AuthProvider } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
import { WeatherProvider } from './context/weatherContext'
import { FavouritesProvider } from './context/FavouritesContext'
import { SettingsProvider } from './context/SettingsContext'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <LocationProvider>
              <WeatherProvider>
                <FavouritesProvider>
                  <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/Favourite" element={<Fav />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Login" element={<Login />} /> 
          <Route path="/Register" element={<Register />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
                </FavouritesProvider>
              </WeatherProvider>
            </LocationProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App;
