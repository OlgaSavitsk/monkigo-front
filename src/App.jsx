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

function App() {

  function UserValidation() {
    return new Promise(resolve => {
      if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
        $.ajax({
          method: 'GET',
          url: 'https://monkigo.com/app/v1/user/validation/info',
          data: { token: localStorage.getItem('token') },
          success: function (content) {
            if (content.data.license !== 'guest' && content.data.expiringDate > 0) {
              return resolve(true);
            }
            else {
              return resolve(false);
            }
          }
        });
      }
    });
  }

  async function Valid() {
    const result = await UserValidation();
    return result;
  }


  Valid().then((value) => {
    if (value === false) {
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/terms-conditions') {
        window.location.href = '/auth';
      }
    }
  }
  );

  function GetRole() {
    if (localStorage.getItem('user') !== null && localStorage.getItem('user') !== undefined) {
      return JSON.parse(localStorage.getItem('user')).role;
    }
    else {
      localStorage.clear();
    }
  }


  return (
    <Router key={new Date()}>
      <div className="App">
        <Routes>
          {
            GetRole() === 'admin' || GetRole() === 'emp' ?
              <Route exact path='/chat' element={<ChatAdmin />} />
              :
              <Route exact path='/chat' element={<ChatUser />} />
          }
          <Route exact path='/auth' element={<Security />} />
          <Route exact path='/' element={<HotelsResults />} />
          <Route exact path={`/hotel`} element={<HotelPage />} />
          <Route exact path='/checkout' element={<HotelCheckout />} />
          <Route exact path='/map' element={<Map />} />
          <Route exact path='/payment-status' element={<PaymentStatus />} />
          <Route exact path='/terms-conditions' element={<TermsConditions />} />
          <Route exact path='/social-tours' element={<SocialTours />} />
          <Route exact path='/tour' element={<SingleTour />} />
          <Route exact path='/tour-checkout' element={<TourCheckout />} />
          <Route exact path='/tour/payment-status' element={<TourPaymentStatus />} />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );

}

export default App;
