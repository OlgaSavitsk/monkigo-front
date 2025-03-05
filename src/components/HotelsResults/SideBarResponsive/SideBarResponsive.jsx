import React, { useState, useEffect, useRef } from 'react';
import './sidebarresponsive.scss';
// Import Swiper React components
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import Slider from '@mui/material/Slider';
////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

// import required modules
import $ from 'jquery';

///IMPORT IMAGES
import RadioUnselected from '../../../assets/hotels-sidebar/radio-unselected.svg';
import RadioSelected from '../../../assets/hotels-sidebar/radio-selected.svg';
import Star from '../../../assets/hotels-sidebar/star.svg';
import CheckboxSelected from '../../../assets/hotels-sidebar/checkbox-selected.svg';
import CheckboxUnselected from '../../../assets/hotels-sidebar/checkbox-unselected.svg';
import FilterClose from '../../../assets/hotels-sidebar/filter-close.svg';

const SideBarResponsive = ({ filterDetails, allHotels }) => {

  const [popupActive, setPopupActive] = useState(null);
  const [popupPosition, setPopupPosition] = useState({});
  const [popularityContent, setPopularityContent] = useState(filterDetails.popularityContent);
  // const [priceValue, setPriceValue] = useState(filterDetails.priceValue);
  const [starRating, setStarRating] = useState({
    five: filterDetails.starRating.five,
    four: filterDetails.starRating.four,
    three: filterDetails.starRating.three,
    two: filterDetails.starRating.two,
    one: filterDetails.starRating.one
  });
  ///CHECKING FILTER ITEM IS FILTERING
  const [priceFiltering, setPriceFiltering] = useState(false);
  const [starRatingFiltering, setStarRatingFiltering] = useState(false);
  const [hotelNameFiltering, setHotelNameFiltering] = useState(false);
  const [hotelNameInputVal, setHotelNameInputVal] = useState('');
  const [changingPrice, setChangingPrice] = useState([]);
  const middlePrice = 20;

  const hotelNameHandleChange = (e) => {
    const { value } = e.target;
    setHotelNameInputVal(value);
  }

  if (window.innerWidth <= 539 && popupActive !== null) {
    $('body, html').css('overflow', 'hidden')
  } else {
    $('body, html').css('overflow', '')
  }

  useEffect(() => {

    $(window).on('click', (e) => {
      setPopupActive(null);
    });
  }, []);

  ////SETTING CHANGING PRICE VSALUE
  useEffect(() => {
    setChangingPrice([filterDetails.priceValue.length > 0 ? filterDetails.priceValue[0] : null, filterDetails.priceValue.length > 0 ? filterDetails.priceValue[1] : null])
  }, [filterDetails.priceValue])

  function valueLabelFormat(value) {
    let scaledValue = value;

    return `${scaledValue} $`;
  }

  const changeRange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setChangingPrice([Math.min(newValue[0], Math.round(changingPrice[1]) - middlePrice), Math.round(changingPrice[1])]);
    } else {
      setChangingPrice([Math.round(changingPrice[0]), Math.max(newValue[1], Math.round(changingPrice[0]) + middlePrice)]);
    }
  };

  ////GIVING POSITION TO POPUPS
  const setPositionPopups = (e) => {
    const xPos = e.currentTarget.getBoundingClientRect().x;
    const yPos = e.currentTarget.offsetTop;
    const checkingRightTrim = xPos + 324;
    const clientWidth = $(window)[0].innerWidth;
    if (checkingRightTrim > clientWidth) {
      setPopupPosition({ right: clientWidth - xPos - $(e.currentTarget)[0].offsetWidth - 18, top: yPos + 43, position: 'right' })
    } else {
      setPopupPosition({ left: xPos, top: yPos + 43, position: 'left' });
    }
  }

  useEffect(() => {

    const slider = document.querySelector('.slider');
    let mouseDown = false;
    let startX, scrollLeft;

    let startDragging = function (e) {
      mouseDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    let stopDragging = function (event) {
      mouseDown = false;
    };

    slider.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if (!mouseDown) { return; }
      const x = e.pageX - slider.offsetLeft;
      const scroll = x - startX;
      slider.scrollLeft = scrollLeft - scroll;
    });

    // Add the event listeners
    slider.addEventListener('mousedown', startDragging, false);
    slider.addEventListener('mouseup', stopDragging, false);
    slider.addEventListener('mouseleave', stopDragging, false);
  });

  const popularityChanging = (e) => {
    $('.dropdown-list .list-item img').attr('src', `${RadioUnselected}`);
    $(e.currentTarget).children('img').attr('src', `${RadioSelected}`);
    if ($(e.currentTarget).children('span').text() === 'Most popular') {
      setPopularityContent(1)
    }
    if ($(e.currentTarget).children('span').text() === 'Lowest Price') {
      setPopularityContent(2);
    }
    if ($(e.currentTarget).children('span').text() === 'Highest star rating') {
      setPopularityContent(3);
    }
  }

  const hotelNameCheckingFunc = (e) => {
    if (hotelNameInputVal !== '') {
      setHotelNameFiltering(true);
      setHotelNameInputVal($('.hotel-name-search-input-responsive').val());
    }
  }

  return (
    <div className="hotels-results-sidebar-responsive">

      {/* POPUPS */}
      {
        popupActive === 'popularity' ?
          window.innerWidth <= 539 ?
            <div className='mobile-popularity-dropdown mobile-filter-dropdown'>
              <div className="mobile-popularity-dropdown-inner" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-header">
                  <h3>Sort by</h3>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setPopupActive(null)}>
                    <path d="M13.295 2.115C13.6844 1.72564 13.6844 1.09436 13.295 0.705C12.9056 0.315639 12.2744 0.315639 11.885 0.705L7.70711 4.88289C7.31658 5.27342 6.68342 5.27342 6.29289 4.88289L2.115 0.705C1.72564 0.315639 1.09436 0.315639 0.705 0.705C0.315639 1.09436 0.315639 1.72564 0.705 2.115L4.88289 6.29289C5.27342 6.68342 5.27342 7.31658 4.88289 7.70711L0.705 11.885C0.315639 12.2744 0.315639 12.9056 0.705 13.295C1.09436 13.6844 1.72564 13.6844 2.115 13.295L6.29289 9.11711C6.68342 8.72658 7.31658 8.72658 7.70711 9.11711L11.885 13.295C12.2744 13.6844 12.9056 13.6844 13.295 13.295C13.6844 12.9056 13.6844 12.2744 13.295 11.885L9.11711 7.70711C8.72658 7.31658 8.72658 6.68342 9.11711 6.29289L13.295 2.115Z" fill="#B1B1B1" />
                  </svg>
                </div>
                <div className='dropdown-list'>
                  <div className='list-item' onClick={(e) => popularityChanging(e)}>
                    <span>Most popular</span>
                    {
                      filterDetails.popularityContent === 1 ?
                        <img src={RadioSelected} alt="" />
                        :
                        <img src={RadioUnselected} alt="" />
                    }
                  </div>
                  <div className='list-item' onClick={(e) => popularityChanging(e)}>
                    <span>Lowest Price</span>
                    {
                      filterDetails.popularityContent === 2 ?
                        <img src={RadioSelected} alt="" />
                        :
                        <img src={RadioUnselected} alt="" />
                    }
                  </div>
                  <div className='list-item' onClick={(e) => popularityChanging(e)}>
                    <span>Highest star rating</span>
                    {
                      filterDetails.popularityContent === 3 ?
                        <img src={RadioSelected} alt="" />
                        :
                        <img src={RadioUnselected} alt="" />
                    }
                  </div>
                </div>
                <div className="dropdown-buttons">
                  <button type='button' className="close-button" onClick={() => { setPopupActive(null); }}>
                    Close
                  </button>
                  <button type='button' className="save-button" onClick={() => { setPopupActive(null); filterDetails.setPopularityContent(popularityContent); filterDetails.setPostState(true); }}>
                    Save
                  </button>
                </div>
              </div>
            </div>
            :
            <div className="responsive-popularity-dropdown responsive-filter-dropdown" style={{ display: popupActive === 'popularity' ? 'flex' : 'none', left: popupPosition.position === 'left' && popupPosition.left, right: popupPosition.position === 'right' && popupPosition.right, top: popupPosition.top }} onClick={(e) => e.stopPropagation()}>
              <div className='dropdown-list'>
                <div className='list-item' onClick={(e) => popularityChanging(e)}>
                  <span>Most popular</span>
                  {
                    filterDetails.popularityContent === 1 ?
                      <img src={RadioSelected} alt="" />
                      :
                      <img src={RadioUnselected} alt="" />
                  }
                </div>
                <div className='list-item' onClick={(e) => popularityChanging(e)}>
                  <span>Lowest Price</span>
                  {
                    filterDetails.popularityContent === 2 ?
                      <img src={RadioSelected} alt="" />
                      :
                      <img src={RadioUnselected} alt="" />
                  }
                </div>
                <div className='list-item' onClick={(e) => popularityChanging(e)}>
                  <span>Highest star rating</span>
                  {
                    filterDetails.popularityContent === 3 ?
                      <img src={RadioSelected} alt="" />
                      :
                      <img src={RadioUnselected} alt="" />
                  }
                </div>
              </div>
              <div className="dropdown-buttons">
                <button type='button' className="close-button" onClick={() => { setPopupActive(null); }}>
                  Close
                </button>
                <button type='button' className="save-button" onClick={() => { setPopupActive(null); filterDetails.setPopularityContent(popularityContent); filterDetails.setPostState(true); }}>
                  Save
                </button>
              </div>
            </div>
          : popupActive === 'price' ?
            window.innerWidth <= 539 ?
              <div className='mobile-price-dropdown mobile-filter-dropdown'>
                <div className="mobile-price-dropdown-inner" onClick={(e) => e.stopPropagation()}>
                  <div className="dropdown-header">
                    <h3>Price</h3>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setPopupActive(null)}>
                      <path d="M13.295 2.115C13.6844 1.72564 13.6844 1.09436 13.295 0.705C12.9056 0.315639 12.2744 0.315639 11.885 0.705L7.70711 4.88289C7.31658 5.27342 6.68342 5.27342 6.29289 4.88289L2.115 0.705C1.72564 0.315639 1.09436 0.315639 0.705 0.705C0.315639 1.09436 0.315639 1.72564 0.705 2.115L4.88289 6.29289C5.27342 6.68342 5.27342 7.31658 4.88289 7.70711L0.705 11.885C0.315639 12.2744 0.315639 12.9056 0.705 13.295C1.09436 13.6844 1.72564 13.6844 2.115 13.295L6.29289 9.11711C6.68342 8.72658 7.31658 8.72658 7.70711 9.11711L11.885 13.295C12.2744 13.6844 12.9056 13.6844 13.295 13.295C13.6844 12.9056 13.6844 12.2744 13.295 11.885L9.11711 7.70711C8.72658 7.31658 8.72658 6.68342 9.11711 6.29289L13.295 2.115Z" fill="#B1B1B1" />
                    </svg>
                  </div>
                  <Slider
                    step={10}
                    min={filterDetails.newPriceValue[0]}
                    max={filterDetails.newPriceValue[1]}
                    value={[changingPrice[0], changingPrice[1]]}
                    onChange={changeRange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={valueLabelFormat}
                    disableSwap
                  />

                  <div className="dropdown-buttons">
                    <button type='button' className="close-button" onClick={() => { setPopupActive(null) }}>
                      Close
                    </button>
                    <button type='button' className="save-button"
                      onClick={() => {
                        setPopupActive(null);
                        filterDetails.setPriceValue(changingPrice);
                        setPriceFiltering(JSON.stringify(filterDetails.changingPrice) === JSON.stringify(filterDetails.newPriceValue) ? false : true);
                        filterDetails.setPostState(true);
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              :
              <div className="responsive-price-dropdown responsive-filter-dropdown" style={{ display: popupActive === 'price' ? 'flex' : 'none', left: popupPosition.position === 'left' && popupPosition.left, right: popupPosition.position === 'right' && popupPosition.right, top: popupPosition.top }} onClick={(e) => e.stopPropagation()}>
                {/* <span style={{ color: '#274DE0' }}>${priceValue[0]} - ${priceValue[1]}</span> */}
                <Slider
                  step={10}
                  min={filterDetails.newPriceValue[0]}
                  max={filterDetails.newPriceValue[1]}
                  value={[changingPrice[0], changingPrice[1]]}
                  onChange={changeRange}
                  valueLabelDisplay="auto"
                  valueLabelFormat={valueLabelFormat}
                  disableSwap
                />

                <div className="dropdown-buttons">
                  <button type='button' className="close-button" onClick={() => { setPopupActive(null) }}>
                    Close
                  </button>
                  <button type='button' className="save-button" onClick={() => {
                    setPopupActive(null);
                    filterDetails.setPriceValue(changingPrice);
                    setPriceFiltering(JSON.stringify(filterDetails.changingPrice) === JSON.stringify(filterDetails.newPriceValue) ? false : true);
                    filterDetails.setPostState(true);
                  }}
                  >
                    Save
                  </button>
                </div>
              </div>
            : popupActive === 'star rating' ?
              window.innerWidth <= 539 ?
                <div className='mobile-star-rating-dropdown mobile-filter-dropdown'>
                  <div className="mobile-star-rating-dropdown-inner" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-header">
                      <h3>Star rating</h3>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setPopupActive(null)}>
                        <path d="M13.295 2.115C13.6844 1.72564 13.6844 1.09436 13.295 0.705C12.9056 0.315639 12.2744 0.315639 11.885 0.705L7.70711 4.88289C7.31658 5.27342 6.68342 5.27342 6.29289 4.88289L2.115 0.705C1.72564 0.315639 1.09436 0.315639 0.705 0.705C0.315639 1.09436 0.315639 1.72564 0.705 2.115L4.88289 6.29289C5.27342 6.68342 5.27342 7.31658 4.88289 7.70711L0.705 11.885C0.315639 12.2744 0.315639 12.9056 0.705 13.295C1.09436 13.6844 1.72564 13.6844 2.115 13.295L6.29289 9.11711C6.68342 8.72658 7.31658 8.72658 7.70711 9.11711L11.885 13.295C12.2744 13.6844 12.9056 13.6844 13.295 13.295C13.6844 12.9056 13.6844 12.2744 13.295 11.885L9.11711 7.70711C8.72658 7.31658 8.72658 6.68342 9.11711 6.29289L13.295 2.115Z" fill="#B1B1B1" />
                      </svg>
                    </div>
                    <div className="dropdown-list">
                      <div className="list-item" onClick={(e) => { starRating.five === false ? setStarRating({ ...starRating, five: true }) : setStarRating({ ...starRating, five: false }) }} data-id="five">
                        <div className="star-area">
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                        </div>
                        <div className="checkbox-area">
                          {
                            starRating.five === true ?
                              <img src={CheckboxSelected} alt="" />
                              :
                              <img src={CheckboxUnselected} alt="" />
                          }
                        </div>
                      </div>
                      <div className="list-item" onClick={(e) => { starRating.four === false ? setStarRating({ ...starRating, four: true }) : setStarRating({ ...starRating, four: false }) }} data-id="four">
                        <div className="star-area">
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                        </div>
                        <div className="checkbox-area">
                          {
                            starRating.four === true ?
                              <img src={CheckboxSelected} alt="" />
                              :
                              <img src={CheckboxUnselected} alt="" />
                          }
                        </div>
                      </div>
                      <div className="list-item" onClick={(e) => { starRating.three === false ? setStarRating({ ...starRating, three: true }) : setStarRating({ ...starRating, three: false }) }} data-id="three">
                        <div className="star-area">
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                        </div>
                        <div className="checkbox-area">
                          {
                            starRating.three === true ?
                              <img src={CheckboxSelected} alt="" />
                              :
                              <img src={CheckboxUnselected} alt="" />
                          }
                        </div>
                      </div>
                      <div className="list-item" onClick={(e) => { starRating.two === false ? setStarRating({ ...starRating, two: true }) : setStarRating({ ...starRating, two: false }) }} data-id="two">
                        <div className="star-area">
                          <img src={Star} alt="star" />
                          <img src={Star} alt="star" />
                        </div>
                        <div className="checkbox-area">
                          {
                            starRating.two === true ?
                              <img src={CheckboxSelected} alt="" />
                              :
                              <img src={CheckboxUnselected} alt="" />
                          }
                        </div>
                      </div>
                      <div className="list-item" onClick={(e) => { starRating.one === false ? setStarRating({ ...starRating, one: true }) : setStarRating({ ...starRating, one: false }) }} data-id="one">
                        <div className="star-area">
                          <img src={Star} alt="star" />
                          <span>or without star rating</span>
                        </div>
                        <div className="checkbox-area">
                          {
                            starRating.one === true ?
                              <img src={CheckboxSelected} alt="" />
                              :
                              <img src={CheckboxUnselected} alt="" />
                          }
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-buttons">
                      <button type='button' className="close-button" onClick={() => { setPopupActive(null); setStarRating({ ...filterDetails.starRating }) }}>
                        Close
                      </button>
                      <button type='button' className="save-button" onClick={() => { setPopupActive(null); filterDetails.setStarRating({ ...starRating }); setStarRatingFiltering(JSON.stringify(starRating) === JSON.stringify(filterDetails.starRating) ? false : true); filterDetails.setPostState(true); }}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                :
                <div className="responsive-star-rating-dropdown responsive-filter-dropdown" style={{ display: popupActive === 'star rating' ? 'flex' : 'none', left: popupPosition.position === 'left' && popupPosition.left, right: popupPosition.position === 'right' && popupPosition.right, top: popupPosition.top }} onClick={(e) => e.stopPropagation()}>

                  <div className="dropdown-list">
                    <div className="list-item" onClick={(e) => { starRating.five === false ? setStarRating({ ...starRating, five: true }) : setStarRating({ ...starRating, five: false }) }} data-id="five">
                      <div className="star-area">
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                      </div>
                      <div className="checkbox-area">
                        {
                          starRating.five === true ?
                            <img src={CheckboxSelected} alt="" />
                            :
                            <img src={CheckboxUnselected} alt="" />
                        }
                      </div>
                    </div>
                    <div className="list-item" onClick={(e) => { starRating.four === false ? setStarRating({ ...starRating, four: true }) : setStarRating({ ...starRating, four: false }) }} data-id="four">
                      <div className="star-area">
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                      </div>
                      <div className="checkbox-area">
                        {
                          starRating.four === true ?
                            <img src={CheckboxSelected} alt="" />
                            :
                            <img src={CheckboxUnselected} alt="" />
                        }
                      </div>
                    </div>
                    <div className="list-item" onClick={(e) => { starRating.three === false ? setStarRating({ ...starRating, three: true }) : setStarRating({ ...starRating, three: false }) }} data-id="three">
                      <div className="star-area">
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                      </div>
                      <div className="checkbox-area">
                        {
                          starRating.three === true ?
                            <img src={CheckboxSelected} alt="" />
                            :
                            <img src={CheckboxUnselected} alt="" />
                        }
                      </div>
                    </div>
                    <div className="list-item" onClick={(e) => { starRating.two === false ? setStarRating({ ...starRating, two: true }) : setStarRating({ ...starRating, two: false }) }} data-id="two">
                      <div className="star-area">
                        <img src={Star} alt="star" />
                        <img src={Star} alt="star" />
                      </div>
                      <div className="checkbox-area">
                        {
                          starRating.two === true ?
                            <img src={CheckboxSelected} alt="" />
                            :
                            <img src={CheckboxUnselected} alt="" />
                        }
                      </div>
                    </div>
                    <div className="list-item" onClick={(e) => { starRating.one === false ? setStarRating({ ...starRating, one: true }) : setStarRating({ ...starRating, one: false }) }} data-id="one">
                      <div className="star-area">
                        <img src={Star} alt="star" />
                        <span>or without star rating</span>
                      </div>
                      <div className="checkbox-area">
                        {
                          starRating.one === true ?
                            <img src={CheckboxSelected} alt="" />
                            :
                            <img src={CheckboxUnselected} alt="" />
                        }
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-buttons">
                    <button type='button' className="close-button" onClick={() => { setPopupActive(null); setStarRating({ ...filterDetails.starRating }) }}>
                      Close
                    </button>
                    <button type='button' className="save-button" onClick={() => { setPopupActive(null); filterDetails.setStarRating({ ...starRating }); setStarRatingFiltering(JSON.stringify(starRating) === JSON.stringify(filterDetails.starRating) ? false : true); filterDetails.setPostState(true); }}>
                      Save
                    </button>
                  </div>
                </div>
              : popupActive === 'hotel name' ?
                window.innerWidth <= 539 ?
                  <div className='mobile-hotel-name-dropdown mobile-filter-dropdown'>
                    <div className="mobile-hotel-name-dropdown-inner" onClick={(e) => e.stopPropagation()}>
                      <div className="dropdown-header">
                        <h3>Meals</h3>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setPopupActive(null)}>
                          <path d="M13.295 2.115C13.6844 1.72564 13.6844 1.09436 13.295 0.705C12.9056 0.315639 12.2744 0.315639 11.885 0.705L7.70711 4.88289C7.31658 5.27342 6.68342 5.27342 6.29289 4.88289L2.115 0.705C1.72564 0.315639 1.09436 0.315639 0.705 0.705C0.315639 1.09436 0.315639 1.72564 0.705 2.115L4.88289 6.29289C5.27342 6.68342 5.27342 7.31658 4.88289 7.70711L0.705 11.885C0.315639 12.2744 0.315639 12.9056 0.705 13.295C1.09436 13.6844 1.72564 13.6844 2.115 13.295L6.29289 9.11711C6.68342 8.72658 7.31658 8.72658 7.70711 9.11711L11.885 13.295C12.2744 13.6844 12.9056 13.6844 13.295 13.295C13.6844 12.9056 13.6844 12.2744 13.295 11.885L9.11711 7.70711C8.72658 7.31658 8.72658 6.68342 9.11711 6.29289L13.295 2.115Z" fill="#B1B1B1" />
                        </svg>
                      </div>
                      <div className="input-area">
                        <input
                          className='hotel-name-search-input-responsive'
                          type="text"
                          placeholder='Enter hotel name...'
                          onChange={hotelNameHandleChange}
                          value={hotelNameInputVal}
                        />
                      </div>

                      <div className="dropdown-buttons">
                        <button type='button' className="close-button" onClick={() => { setPopupActive(null) }}>
                          Close
                        </button>
                        <button type='button' className="save-button" onClick={(e) => {
                          setPopupActive($('.hotel-name-search-input-responsive').val() === '' ? 'hotel name' : null); hotelNameCheckingFunc();
                          filterDetails.setSideBarHotelNameBtn($('.hotel-name-search-input-responsive').val());
                          filterDetails.setPostState(true);
                        }}>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="responsive-hotel-name-dropdown responsive-filter-dropdown" style={{ display: popupActive === 'hotel name' ? 'flex' : 'none', left: popupPosition.position === 'left' && popupPosition.left, right: popupPosition.position === 'right' && popupPosition.right, top: popupPosition.top }} onClick={(e) => e.stopPropagation()}>

                    <div className="input-area">
                      <input
                        className='hotel-name-search-input-responsive'
                        type="text"
                        placeholder='Enter hotel name'
                        onChange={hotelNameHandleChange}
                        value={hotelNameInputVal}
                      />
                    </div>

                    <div className="dropdown-buttons">
                      <button type='button' className="close-button" onClick={() => { setPopupActive(null) }}>
                        Close
                      </button>
                      <button type='button' className="save-button"
                        onClick={(e) => {
                          setPopupActive($('.hotel-name-search-input-responsive').val() === '' ? 'hotel name' : null);
                          hotelNameCheckingFunc();
                          filterDetails.setSideBarHotelNameBtn($('.hotel-name-search-input-responsive').val());
                          filterDetails.setPostState(true);
                        }}>
                        Save
                      </button>
                    </div>
                  </div>
                :
                null

      }

      {/* SLIDER ITEMS */}
      {
        allHotels !== null || allHotels !== undefined ?
          <div className="single-slide-item popularity popularity-popup " style={{ minWidth: '98px' }} onClick={(e) => { popupActive === 'popularity' ? setPopupActive(null) : setPopupActive('popularity'); setPositionPopups(e); e.stopPropagation() }}>
            <div className="single-slide-item-inner">
              <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.27836e-05 1.3C6.27836e-05 1.08783 0.0878603 0.884344 0.244141 0.734315C0.400421 0.584286 0.612382 0.5 0.833396 0.5H9.16673C9.38774 0.5 9.5997 0.584286 9.75599 0.734315C9.91227 0.884344 10.0001 1.08783 10.0001 1.3C10.0001 1.51217 9.91227 1.71566 9.75599 1.86569C9.5997 2.01571 9.38774 2.1 9.16673 2.1H0.833396C0.612382 2.1 0.400421 2.01571 0.244141 1.86569C0.0878603 1.71566 6.27836e-05 1.51217 6.27836e-05 1.3ZM6.27836e-05 4.5C6.27836e-05 4.28783 0.0878603 4.08434 0.244141 3.93431C0.400421 3.78429 0.612382 3.7 0.833396 3.7H5.8334C6.05441 3.7 6.26637 3.78429 6.42265 3.93431C6.57893 4.08434 6.66673 4.28783 6.66673 4.5C6.66673 4.71217 6.57893 4.91566 6.42265 5.06569C6.26637 5.21571 6.05441 5.3 5.8334 5.3H0.833396C0.612382 5.3 0.400421 5.21571 0.244141 5.06569C0.0878603 4.91566 6.27836e-05 4.71217 6.27836e-05 4.5ZM0.833396 6.9C0.612382 6.9 0.400421 6.98429 0.244141 7.13432C0.0878603 7.28434 6.27836e-05 7.48783 6.27836e-05 7.7C6.27836e-05 7.91217 0.0878603 8.11566 0.244141 8.26569C0.400421 8.41572 0.612382 8.5 0.833396 8.5H2.50006C2.72108 8.5 2.93304 8.41572 3.08932 8.26569C3.2456 8.11566 3.3334 7.91217 3.3334 7.7C3.3334 7.48783 3.2456 7.28434 3.08932 7.13432C2.93304 6.98429 2.72108 6.9 2.50006 6.9H0.833396Z" fill='#101010' />
              </svg>
              <span>Sort By</span>
              <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: popupActive === 'popularity' ? 'rotate(0)' : 'rotate(180deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M0.159095 3.68359L3.61591 0.640074C3.82804 0.453309 4.17196 0.453309 4.38409 0.640074L7.8409 3.68359C8.05303 3.87035 8.05303 4.17316 7.8409 4.35993C7.62878 4.54669 7.28485 4.54669 7.07272 4.35993L4 1.65458L0.927276 4.35993C0.715149 4.54669 0.371223 4.54669 0.159095 4.35993C-0.0530318 4.17316 -0.0530319 3.87035 0.159095 3.68359Z" fill='#101010' />
              </svg>
            </div>
          </div>
          :
          <Skeleton variant="rounded" style={{ minWidth: '98px', borderRadius: '8px', marginRight: '8px' }} height={'100%'} />
      }


      <ul className='slider'>
        {
          allHotels !== null || allHotels !== undefined ?
            <li onClick={(e) => { popupActive === 'price' ? setPopupActive(null) : setPopupActive('price'); setPositionPopups(e); e.stopPropagation() }}>
              <div className="single-slide-item price price-popup" style={{ background: priceFiltering === true ? '#274DE0' : '#fff' }}>
                <div className="single-slide-item-inner">
                  <span style={{ color: priceFiltering === true ? '#fff' : '#101010' }}>Price</span>
                  {
                    priceFiltering === true ?
                      <div className="reset-filter-btn" onClick={(e) => { setPriceFiltering(false); filterDetails.setPriceValue(filterDetails.newPriceValue); setPopupActive(null); filterDetails.setPostState(true); e.stopPropagation() }}>
                        <img src={FilterClose} alt="" />
                      </div>
                      :
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: popupActive === 'price' ? 'rotate(0)' : 'rotate(180deg)' }}>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.159095 3.68359L3.61591 0.640074C3.82804 0.453309 4.17196 0.453309 4.38409 0.640074L7.8409 3.68359C8.05303 3.87035 8.05303 4.17316 7.8409 4.35993C7.62878 4.54669 7.28485 4.54669 7.07272 4.35993L4 1.65458L0.927276 4.35993C0.715149 4.54669 0.371223 4.54669 0.159095 4.35993C-0.0530318 4.17316 -0.0530319 3.87035 0.159095 3.68359Z" fill='#101010' />
                      </svg>
                  }

                </div>
              </div>
            </li>
            :
            <Skeleton variant="rounded" style={{ minWidth: '90px', borderRadius: '8px', marginRight: '8px' }} height={'35px'} />
        }


        {
          allHotels !== null || allHotels !== undefined ?
            <li style={{ minWidth: starRatingFiltering === false ? '105.13px' : '118px' }} onClick={(e) => { popupActive === 'star rating' ? setPopupActive(null) : setPopupActive('star rating'); setPositionPopups(e); e.stopPropagation() }}>
              <div className="single-slide-item star-rating star-rating-popup" style={{ background: starRatingFiltering === true ? '#274DE0' : '#fff' }}>
                <div className="single-slide-item-inner">
                  <span style={{ color: starRatingFiltering === true ? '#fff' : '#101010' }}>Star rating</span>
                  {
                    starRatingFiltering === true ?
                      <div className="reset-filter-btn" onClick={(e) => { setStarRatingFiltering(false); filterDetails.setStarRating({ one: false, two: false, three: false, four: false, five: false }); setStarRating({ one: false, two: false, three: false, four: false, five: false }); setPopupActive(null); filterDetails.setPostState(true); e.stopPropagation() }}>
                        <img src={FilterClose} alt="" />
                      </div>
                      :
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: popupActive === 'star rating' ? 'rotate(0)' : 'rotate(180deg)' }}>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.159095 3.68359L3.61591 0.640074C3.82804 0.453309 4.17196 0.453309 4.38409 0.640074L7.8409 3.68359C8.05303 3.87035 8.05303 4.17316 7.8409 4.35993C7.62878 4.54669 7.28485 4.54669 7.07272 4.35993L4 1.65458L0.927276 4.35993C0.715149 4.54669 0.371223 4.54669 0.159095 4.35993C-0.0530318 4.17316 -0.0530319 3.87035 0.159095 3.68359Z" fill='#101010' />
                      </svg>
                  }

                </div>
              </div>
            </li>
            :
            <Skeleton variant="rounded" style={{ minWidth: '118px', borderRadius: '8px', marginRight: '8px' }} height={'35px'} />
        }


        {
          allHotels !== null || allHotels !== undefined ?
            <li style={{ minWidth: hotelNameFiltering === false ? '110.09px' : '122.09px' }} onClick={(e) => { popupActive === 'hotel name' ? setPopupActive(null) : setPopupActive('hotel name'); setPositionPopups(e); e.stopPropagation() }}>
              <div className="single-slide-item hotel-name hotel-name-popup" style={{ background: hotelNameFiltering === true ? '#274DE0' : '#fff' }}>
                <div className="single-slide-item-inner">
                  <span style={{ color: hotelNameFiltering === true ? '#fff' : '#101010' }}>Hotel name</span>
                  {
                    hotelNameFiltering === true ?
                      <div className="reset-filter-btn"
                        onClick={(e) => {
                          setHotelNameFiltering(false);
                          setHotelNameInputVal('');
                          setPopupActive(null);
                          e.stopPropagation();
                          filterDetails.setSideBarHotelNameBtn('');
                          filterDetails.setPostState(true);
                        }}>
                        <img src={FilterClose} alt="" />
                      </div>
                      :
                      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: popupActive === 'hotel name' ? 'rotate(0)' : 'rotate(180deg)' }}>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.159095 3.68359L3.61591 0.640074C3.82804 0.453309 4.17196 0.453309 4.38409 0.640074L7.8409 3.68359C8.05303 3.87035 8.05303 4.17316 7.8409 4.35993C7.62878 4.54669 7.28485 4.54669 7.07272 4.35993L4 1.65458L0.927276 4.35993C0.715149 4.54669 0.371223 4.54669 0.159095 4.35993C-0.0530318 4.17316 -0.0530319 3.87035 0.159095 3.68359Z" fill='#101010' />
                      </svg>
                  }
                </div>
              </div>
            </li>
            :
            <Skeleton variant="rounded" style={{ minWidth: '122.09px', borderRadius: '8px', marginRight: '8px' }} height={'35px'} />
        }

      </ul>
    </div >
  )
}

export default SideBarResponsive