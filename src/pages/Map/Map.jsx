import React, { useState, useEffect } from 'react';
import './map.scss';

///IMPORT COMPONENTS
import Navbar from '../../components/Navbar/Navbar';
import 'maplibre-gl/dist/maplibre-gl.css';
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

////IMPORT IMAGES
import ArrowBackBlack from '../../assets/hotel-checkout/arrow-back-black.svg';

const HotelsMap = () => {

   const navigate = useNavigate();
   const [allHotels, setAllHotels] = useState([]);
   const [initialFlag, setInitialFlag] = useState(false);
   const [allMapLocations, setAllMapLocations] = useState([])
   var token = localStorage.getItem('token');

   if (allMapLocations) {
      let obj = JSON.stringify(allMapLocations);
      localStorage.setItem('allMapLocation', obj)
   }

   useEffect(() => {

      function appendMap() {
         var style = document.createElement('link');
         var style2 = document.createElement('link');
         var script1 = document.createElement('script');
         var script2 = document.createElement('script');
         var script3 = document.createElement('script');
         var mapjs = document.createElement('script');

         script1.src = '/leaflet.js';
         script2.src = '/maplibre-gl.js';
         script3.src = '/leaflet-maplibre-gl.js';
         mapjs.src = '/bigMap.js';
         style.href = '/leaflet.css';
         style2.href = '/maplibre-gl.css';
         style.rel = 'stylesheet';
         style2.rel = 'stylesheet';

         setTimeout(() => {
            document.head.appendChild(script1);
            document.head.appendChild(style);
            document.head.appendChild(style2);
         }, 1000);
         setTimeout(() => {
            document.head.appendChild(script2);
         }, 1100);
         setTimeout(() => {
            document.head.appendChild(script3);
         }, 1200);

         setTimeout(() => {
            document.body.appendChild(mapjs);
         }, 1300);

      }
      appendMap();

   }, []);

   function GetAllHotels() {
      $.ajax({
         method: 'GET',
         url: "https://monkigo.com/app/v1/iac2023/hotels/all?",
         data: { token: token },
         dataType: "json",
         success: function (data) {
            setAllHotels(data.data.hotels);
            data.data.hotels.forEach((h, i) => {
               allMapLocations.push({
                  lat: h.latitude,
                  long: h.longitude,
                  name: h.name
               });
               console.log(h);
            })
            setInitialFlag(true);
         },
         error: function (jqXHR, textStatus, errorThrown) {
            window.location.href='/auth';
         }
      });
   }

   useEffect(() => {
      if (token !== null) {
         GetAllHotels();
      }
   }, []);

   return (
      <div className="map-section">
         <Navbar />

         <div className="map-wrapper">
            <button onClick={() => navigate(-1)} type='button' className='back-button'><img src={ArrowBackBlack} alt="" />Back</button>
            <div id="map"></div>
         </div>
      </div>
   )
}

export default HotelsMap