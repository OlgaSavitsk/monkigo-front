import React, { useEffect, useState } from 'react';

import './hotelpage.scss';
import $ from 'jquery';


///IMPORT COMPONENT
import Navbar from '../../components/Navbar/Navbar';
import HotelImages from '../../components/HotelPage/HotelImages/HotelImages';
import Details from '../../components/HotelPage/Details/Details';
import Reservation from '../../components/HotelPage/Reservation/Reservation';
import Rooms from '../../components/HotelPage/Rooms/Rooms';


const HotelPage = () => {

   const [hotel, setHotel] = useState(null);

   var token = localStorage.getItem('token');

   useEffect(() => {
     GetHotel();
   }, []);


   function GetHotel() {
      if (localStorage.getItem('cin') === null || localStorage.getItem('cin') === undefined) {
         localStorage.setItem('cin', GetDate(0));
      }
      if (localStorage.getItem('cout') === null || localStorage.getItem('cout') === undefined || localStorage.getItem('cout') === 'NaN-NaN-NaN') {
         localStorage.setItem('cout', GetDateAddDay(1));
      }
      
      var hid = new URLSearchParams(window.location.search).get('hid');
      $.ajax({
         method: 'GET',
         url: "https://monkigo.com/app/v1/iac2023/hotel",
         data: { token: token, cin: localStorage.getItem('cin'),cout:localStorage.getItem('cout'), hid: hid },
         dataType: "json",
         success: function (data) {
            setHotel(data.data);
            var location = {
               long:data.data.longitude,
               lat:data.data.latitude
            }
            localStorage.setItem('location',JSON.stringify(location));
         },
         error: function (jqXHR, textStatus, errorThrown) {
            var responseText = JSON.parse(jqXHR.responseText);
            if (responseText.result.code === 403) {
               if (responseText.data !== null || responseText.data !== undefined) {
                  if (responseText.data?.license === 'guest' || responseText.data?.expiringDate <= 0) {
                     window.location.href ='/auth'                     
                  }
                  else{
                     window.location.href = "/auth";
                  }
               }
               else {

               }
            }
         }
      });
   }

   function GetDate(dayAdd) {
      var date = new Date();
      var day = date.getDate()
      var month = date.getMonth();
      var year = date.getFullYear();

      let dayStr, monthStr, yearStr = '';
      if (day+dayAdd < 10) {
         if (dayAdd !== null || dayAdd !== undefined) {
            dayStr = `0${day + dayAdd}`;
         }
         else {
            dayStr = `0${day}`;
         }
      }
      else{
         dayStr = day+dayAdd;
      }


      if (month+1 < 10)
         monthStr = `0${month + 1}`;

      yearStr = year;
      return `${monthStr}-${dayStr}-${yearStr}`;
   }

   function GetDateAddDay(day) {
      var dateArray = localStorage.getItem('cin').split('-');
      var date = new Date(parseInt(dateArray[2]),parseInt(dateArray[0])-1,parseInt(dateArray[1]));
      date.setDate(date.getDate() + day);
      var day = date.getDate()
      var month = date.getMonth();
      var year = date.getFullYear();
  
      let dayStr, monthStr, yearStr = '';
      if (day < 10) {
        dayStr = `0${day}`;
      }
      else {
        dayStr = day
      }
      if (month + 1 < 10) {
        monthStr = `0${month + 1}`;
      }
      else {
        monthStr = month + 1;
      }
  
      yearStr = year;
  
      return `${monthStr}-${dayStr}-${yearStr}`;
  
    }



   return (
      <div className="hotel-page-section">
         <Navbar />
         <HotelImages hotel={hotel} />
         <div className="hotel-page-main-details-section">
            <div className="main-details-section-inner">
               <Details hotel={hotel} />
               <Reservation hotel={hotel} />
            </div>
         </div>
         <Rooms hotel={hotel} />
      </div>
   )
}

export default HotelPage