import React from 'react';
import $ from 'jquery';
import './App.scss';

///Components and Pages
import HotelsResults from './pages/HotelsResults/HotelsResults';
//React Router Dom
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import HotelPage from './pages/HotelPage/HotelPage';
import HotelCheckout from './pages/HotelCheckout/HotelCheckout';
import Security from './components/Security/Security';
import Map from './pages/Map/Map';
import PaymentStatus from './pages/PaymentStatus/PaymentStatus';
import TermsConditions from './pages/TermsConditions/TermsConditions';
import ChatAdmin from './pages/ChatAdmin/ChatAdmin';
import ChatUser from './pages/ChatUser/ChatUser';
import SocialTours from './pages/SocialTours/SocialTours';
import SingleTour from './pages/SingleTour/SingleTour';
import TourCheckout from './pages/TourCheckout/TourCheckout';
import TourPaymentStatus from './pages/PaymentStatusTour/PaymentStatusTour';
import Admin from './pages/ChatAdmin/Admin';
import { useAuth } from './context/AuthContext';
import AuthGuard from './context/AuthGuard';

function App() {
  const { userData } = useAuth();
  const userRole = userData ? userData.support : null;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
                path='/admin' 
                element={userRole ? <Admin /> : <Navigate to="/chat" replace />} 
            />
            <Route 
                path='/chat' 
                element={
                  <AuthGuard>
                      <ChatUser />
                  </AuthGuard>
              } 
            />
          <Route exact path='/auth' element={<Security />} />
          <Route exact path='/hotels' element={<HotelsResults />} />
          <Route exact path={`/hotel`} element={<HotelPage />} />
          <Route exact path='/checkout' element={<HotelCheckout />} />
          <Route exact path='/map' element={<Map />} />
          <Route exact path='/payment-status' element={<PaymentStatus />} />
          <Route exact path='/terms-conditions' element={<TermsConditions />} />
          <Route exact path='/social-tours' element={<SocialTours />} />
          <Route exact path='/tour' element={<SingleTour />} />
          <Route exact path='/tour-checkout' element={<TourCheckout />} />
          <Route exact path='/tour/payment-status' element={<TourPaymentStatus />} />
          <Route path="*" element={<Navigate to={userRole ? "/admin" : "/chat"} replace />} />
        </Routes>
      </div>
    </Router>
  );

}

export default App;
