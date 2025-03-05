import React, { useEffect, useState } from 'react';

///IMPORT SCSS
import './hotelsresults.scss';

import $, { data } from 'jquery';

///IMPORT COMPONENTS
import Search from '../../components/HotelsResults/Search/Search';
import SideBar from '../../components/HotelsResults/SideBar/SideBar';
import HotelsPosts from '../../components/HotelsResults/HotelsPosts/HotelsPosts';
import SideBarResponsive from '../../components/HotelsResults/SideBarResponsive/SideBarResponsive';
import Navbar from '../../components/Navbar/Navbar';

const HotelsResults = () => {
  const [postState, setPostState] = useState(false);
  const [initialFlag, setInitialFlag] = useState(false);
  const [sideBarHotelNameBtn, setSideBarHotelNameBtn] = useState('');
  const [filter, setFilter] = useState(true);
  const [popularityDropdownActive, setPopularityDropdownActive] = useState(false);
  const [popularityContent, setPopularityContent] = useState(1);  ////1 = most popular 2 = lowest price 3 = highest star rating
  const [priceValue, setPriceValue] = useState([]);
  const [newPriceValue, setNewPriceValue] = useState([]);
  const [starRating, setStarRating] = useState({
    five: false,
    four: false,
    three: false,
    two: false,
    one: false
  });
  const [hotelSearchBtnClick, setHotelSearchBtnClick] = useState(false);



  ////GETTING ALL HOTELS
  const [allHotels, setAllHotels] = useState(null);

  ////FILTER DETAILS
  const filterDetails = {
    filter,
    setFilter,
    popularityDropdownActive,
    setPopularityDropdownActive,
    popularityContent,
    setPopularityContent,
    priceValue,
    setPriceValue,
    newPriceValue,
    setNewPriceValue,
    starRating,
    setStarRating,
    sideBarHotelNameBtn,
    setSideBarHotelNameBtn,
    hotelSearchBtnClick,
    setHotelSearchBtnClick,
    setPostState
  }

  useEffect(() => {
    GetAllHotels();
  }, []);

  function GetAllHotels() {

    localStorage.removeItem('cin');
    localStorage.removeItem('cout');

    if(localStorage.getItem('cin')===null || localStorage.getItem('cin')===undefined){
      localStorage.setItem('cin',GetDate());
     }
  
     if(localStorage.getItem('cout')===null || localStorage.getItem('cout')===undefined){
       localStorage.setItem('cout',GetDateAddDay(1));
     }

    $.ajax({
      method: 'GET',
      url: "https://monkigo.com/app/v1/iac2023/hotels/all?",
      data: { token: localStorage.getItem('token'), cin: GetDate() },
      dataType: "json",
      success: function (data) {
        setTimeout(() => {
          setAllHotels(data.data.hotels);
          setPriceValue([Math.round(data.data.filters.prices[0]), Math.round(data.data.filters.prices[1])]);
          setNewPriceValue([Math.round(data.data.filters.prices[0]), Math.round(data.data.filters.prices[1])]);
          setInitialFlag(true);
        }, 500)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        var responseText = JSON.parse(jqXHR.responseText);
        if (responseText.result.code === 403) {
          if (responseText.data !== null || responseText.data !== undefined) {
            if (responseText.data?.license === 'guest' || responseText.data?.expiringDate <= 0) {
              // pop-up
              window.location.href = "/auth"
              // GetLicense();
            }
            else{
              window.location.href = "/auth";
            }
          }
          else {
            window.location.href = "/auth"
          }
        } else {
          window.location.href = "/auth";
        }
      }
    });
  }

  function GetHotelsFilters(params) {
    ////ZEROED ALL HOTELS FOR SHOWING SKELETON 
    if (postState) {
      setAllHotels(null);
      $.ajax({
        method: 'POST',
        url: `https://monkigo.com/app/v1/iac2023/hotels?token=${localStorage.getItem('token')}&cin=${params.cin}&cout=${localStorage.getItem('cout')}&name=${params.name}&sort=${params.sort}`,
        data: { star: params.stars, prices: params.prices },
        dataType: "json",
        success: function (data) {
          if (data.data.hotels !== undefined) {
            setAllHotels(data.data.hotels);
          }
          if (data.data.length === 0) {
            setAllHotels([]);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          var responseText = JSON.parse(jqXHR.responseText);
          if (responseText.result.code === 403) {
            if (responseText.data !== null || responseText.data !== undefined) {
              if (responseText.data.license === 'guest' || responseText.data.expiringDate <= 0) {
                // pop-up
                window.location.href = "/auth"
              }
            }
            else {
              window.location.href = "/auth"
            }
          }
        }
      });
      setPostState(false);
    }
  }

  function SearchHotels() {
    ////ZEROED ALL HOTELS FOR SHOWING SKELETON 
    if (postState) {
      $.ajax({
        method: 'GET', 
        url: `https://monkigo.com/app/v1/iac2023/hotels/search`,
        data: { token: localStorage.getItem('token'), cin: localStorage.getItem('cin'), cout: localStorage.getItem("cout") },
        dataType: "json",
        success: function (data) {
          setAllHotels(data.data.hotels);
          setPriceValue([Math.round(data.data.filters.prices[0]), Math.round(data.data.filters.prices[1])]);
          setNewPriceValue([Math.round(data.data.filters.prices[0]), Math.round(data.data.filters.prices[1])]);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          var responseText = JSON.parse(jqXHR.responseText);
          if (responseText.result.code === 403) {
            if (responseText.data !== null || responseText.data !== undefined) {
              if (responseText.data.license === 'guest' || responseText.data.expiringDate <= 0) {
                // pop-up
                localStorage.clear();
                window.location.href = "/auth"
              }
            }
            else {
              window.location.href = "/auth"
            }
          }
        }
      });
    }
    setPostState(false);
  }

  function StarParamPre(filterDetails) {
    var stars = '';
    if (filterDetails.one) {
      stars += '1,';
    }

    if (filterDetails.two) {
      stars += '2,';
    }

    if (filterDetails.three) {
      stars += '3,';
    }

    if (filterDetails.four) {
      stars += '4,';
    }

    if (filterDetails.five) {
      stars += '5';
    }

    return stars;
  }

  function GetDate() {
    var date = new Date();
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


  useEffect(() => {
    if (initialFlag) {

      GetHotelsFilters({
        cin: localStorage.getItem('cin') !== null || localStorage.getItem('cin') !== undefined ? localStorage.getItem('cin') : GetDate(),
        sort: filterDetails.popularityContent,
        name: filterDetails.sideBarHotelNameBtn,
        prices: filterDetails.priceValue,
        stars: StarParamPre(filterDetails.starRating)
      });
    }
  }, [initialFlag,
    filterDetails.popularityContent,
    filterDetails.starRating,
    filterDetails.priceValue,
    filterDetails.sideBarHotelNameBtn
  ]);

  useEffect(() => {
    if (localStorage.getItem('cin') === null || localStorage.getItem('cin') === undefined) {
      localStorage.setItem('cin', GetDate());
    }

    if (localStorage.getItem('cout') === null || localStorage.getItem('cout') === undefined) {
      localStorage.setItem('cout', GetDateAddDay(1));
    }

    setAllHotels(null);
    SearchHotels();

  }, [hotelSearchBtnClick]);


  return (
    <div className="hotels-results-section">
      <Navbar />
      <Search filterDetails={filterDetails} />
      <div className="hotels-body-wrapper">
        <div className="hotels-body-wrapper-inner">
          <SideBar filterDetails={filterDetails} allHotels={allHotels} setAllHotels={setAllHotels} />
          <SideBarResponsive filterDetails={filterDetails} allHotels={allHotels} setAllHotels={setAllHotels} />
          <HotelsPosts filterDetails={filterDetails} allHotels={allHotels} setAllHotels={setAllHotels} />
        </div>
      </div>
    </div>
  )
}

export default HotelsResults