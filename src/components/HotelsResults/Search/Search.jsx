import React, { useState, useEffect, useRef } from 'react';
///IMPORT SCSS
import './search.scss';
import './headerDropdownStyles.scss';
import '../../dropdowns/search-block/header-section/guests-rooms/guestsrooms.scss';

//IMPORT COMPONENTS
import $ from 'jquery';
import 'react-calendar/dist/Calendar.css';
///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

////IMPORT MUI DATE PICKER
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LicenseInfo } from '@mui/x-license-pro';


LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENSE_KEY);

const Search = ({ filterDetails }) => {
   //CALENDAR DROPDOWN TOGGLE
   const [dropdownToggle, setDropdownToggle] = useState(null);
   ///Popup Toggle
   const [guestsRoomsPopupToggle, setGuestsRoomsPopupToggle] = useState(false);
   ///Guests Rooms states
   const [guestsRoomsAdultNumber, setGuestsRoomsAdultNumber] = useState(1);
   const [guestsRoomsChildrenNumber, setGuestsRoomsChildrenNumber] = useState(0);
   const [roomsNumber, setRoomsNumber] = useState(1);
   const [childCount, setChildCount] = useState([]);
   const [value, setValue] = React.useState([new Date().toDateString(), new Date(2023, new Date().getMonth(), new Date().getDate() + 1).toDateString()]);


   ///AUTO ANIMATE
   const parent = useRef(null);

   $('body').on('click', function () {
      setDropdownToggle(null);
   });

   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   //////////////////////////////////////////GUESTS ROOMS DROPDOWN FUNCTIONS////////////////////////////////////////////

   useEffect(() => {
      var guestInfo = {
         adults: guestsRoomsAdultNumber,
         childrens: guestsRoomsChildrenNumber,
         rooms: roomsNumber
      }

      localStorage.setItem('guestInfo', JSON.stringify(guestInfo));

   }, [guestsRoomsAdultNumber, guestsRoomsChildrenNumber, roomsNumber])

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);

   ///Child Increase function
   const childIncreaseFunction = (childNumber) => {
      childCount.push(childNumber += 1);
   }

   ///Child Increase function
   const childDecreaseFunction = () => {
      childCount.pop();
   }

   function GetDate(date) {
      let day = '';
      let month = '';
      if ((date?.$D + 1) < 10) {
         day = `0${date?.$D}`;
      }
      else {
         day = date?.$D;
      }
      
      if ((date?.$M + 1) < 10) {
         month = `0${date?.$M + 1}`;
      }
      else {
         month = date?.$M + 1;
      }

      return `${month}-${day}-${date?.$y}`
   }


   return (
      <div className="hotels-results-search-section">
         <div className="search-section-inner">
            {/* HEADER DROPDOWN SECTION */}
            <div className="header-dropdown-section">
               <ul>
                  <div className="list-wrapper guests-rooms-list-wrapper">
                     <li className='guests-rooms-dropdown-li' onClick={(e) => { dropdownToggle === 'guests rooms' ? setDropdownToggle(null) : setDropdownToggle('guests rooms'); e.stopPropagation() }}>
                        {`${guestsRoomsAdultNumber + guestsRoomsChildrenNumber} Guests, ${roomsNumber} Room`}
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: guestsRoomsPopupToggle === true ? 'rotate(180deg)' : 'rotate(0)' }}>
                           <path fillRule="evenodd" clipRule="evenodd" d="M9.80113 1.22462L5.48011 5.78989C5.21495 6.07004 4.78505 6.07004 4.51989 5.78989L0.19887 1.22462C-0.0662899 0.944468 -0.0662899 0.490258 0.19887 0.210111C0.464029 -0.0700374 0.893937 -0.0700374 1.1591 0.210111L5 4.26813L8.8409 0.210111C9.10606 -0.070037 9.53597 -0.070037 9.80113 0.210111C10.0663 0.490259 10.0663 0.944468 9.80113 1.22462Z" fill="#fff" />
                        </svg>
                     </li>

                     {
                        window.innerWidth <= 629 ?
                           <div className='mobile-guests-rooms-popup-wrapper' style={{ display: dropdownToggle === 'guests rooms' ? 'flex' : 'none' }} onClick={() => { setRoomsNumber(1); setGuestsRoomsAdultNumber(1); setGuestsRoomsChildrenNumber(0) }}>
                              <div className="mobile-guests-rooms-popup-inner" onClick={(e) => e.stopPropagation()}>
                                 <div className="dropdown-list">
                                    <div className="list-item">
                                       <div className="item-wrapper">
                                          <div className="item-content">
                                             <span className='title'>Adults</span>
                                          </div>
                                          <div className="item-counter">
                                             <button type='button' onClick={() => setGuestsRoomsAdultNumber((prev) => prev -= 1)} disabled={guestsRoomsAdultNumber === 1}>-</button>
                                             <span className='count-text'>{guestsRoomsAdultNumber}</span>
                                             <button type='button' onClick={() => setGuestsRoomsAdultNumber((prev) => prev += 1)} disabled={guestsRoomsAdultNumber === 6}>+</button>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="list-item">
                                       <div className="item-wrapper">
                                          <div className="item-content">
                                             <span className='title'>Children</span>
                                             <span className="description">0-17</span>
                                          </div>
                                          <div className="item-counter">
                                             <button type='button' onClick={() => { setGuestsRoomsChildrenNumber((prev) => prev -= 1); childDecreaseFunction(guestsRoomsChildrenNumber) }} disabled={guestsRoomsChildrenNumber === 0}>-</button>
                                             <span className='count-text'>{guestsRoomsChildrenNumber}</span>
                                             <button type='button' onClick={() => { setGuestsRoomsChildrenNumber((prev) => prev += 1); childIncreaseFunction(guestsRoomsChildrenNumber) }} disabled={guestsRoomsChildrenNumber === 4}>+</button>
                                          </div>
                                       </div>
                                       {/* <div className="child-age-wrapper" ref={parent}>
                                          {
                                             childAdding(guestsRoomsChildrenNumber).map((i) => {
                                                return <div className="child-age-inner" key={i}>
                                                   <span className='title'>Enter age</span>
                                                   <div className="counter-wrapper">
                                                      <button type='button' onClick={(e) => decreaseChildAge(e, i)}>-</button>
                                                      <input type="number" className="child-age" maxLength={2} onKeyDown={(event) => { ageHandleChange(event) }} placeholder='0' />
                                                      <button type='button' onClick={(e) => increaseChildAge(e, i)}>+</button>
                                                   </div>
                                                </div>
                                             })
                                          }
                                       </div> */}
                                    </div>
                                    <div className="list-item" style={{ borderBottom: 0, paddingBottom: 0 }}>
                                       <div className="item-wrapper">
                                          <div className="item-content">
                                             <span className='title'>Rooms</span>
                                          </div>
                                          <div className="item-counter">
                                             <button type='button' onClick={() => setRoomsNumber((prev) => prev -= 1)} disabled={roomsNumber === 1}>-</button>
                                             <span className='count-text'>{roomsNumber}</span>
                                             <button type='button' onClick={() => setRoomsNumber((prev) => prev += 1)} disabled={roomsNumber === 6}>+</button>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="dropdown-buttons">
                                       <button type='button' className="close-button" onClick={() => { setDropdownToggle(null); setGuestsRoomsAdultNumber(1); setGuestsRoomsChildrenNumber(0); setRoomsNumber(1); }}>
                                          Close
                                       </button>
                                       <button type='button' className="save-button" onClick={() => { setDropdownToggle(null) }}>
                                          Save
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           :
                           <div className="guests-rooms-popup" style={{ display: dropdownToggle === 'guests rooms' ? 'block' : 'none' }} onClick={(e) => e.stopPropagation()}>
                              <div className="dropdown-list">
                                 <div className="list-item">
                                    <div className="item-wrapper">
                                       <div className="item-content">
                                          <span className='title'>Adults</span>
                                       </div>
                                       <div className="item-counter">
                                          <button type='button' onClick={() => setGuestsRoomsAdultNumber((prev) => prev -= 1)} disabled={guestsRoomsAdultNumber === 1}>-</button>
                                          <span className='count-text'>{guestsRoomsAdultNumber}</span>
                                          <button type='button' onClick={() => setGuestsRoomsAdultNumber((prev) => prev += 1)} disabled={guestsRoomsAdultNumber === 6}>+</button>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="list-item">
                                    <div className="item-wrapper">
                                       <div className="item-content">
                                          <span className='title'>Children</span>
                                          <span className="description">0-17</span>
                                       </div>
                                       <div className="item-counter">
                                          <button type='button' onClick={() => { setGuestsRoomsChildrenNumber((prev) => prev -= 1); childDecreaseFunction(guestsRoomsChildrenNumber) }} disabled={guestsRoomsChildrenNumber === 0}>-</button>
                                          <span className='count-text'>{guestsRoomsChildrenNumber}</span>
                                          <button type='button' onClick={() => { setGuestsRoomsChildrenNumber((prev) => prev += 1); childIncreaseFunction(guestsRoomsChildrenNumber) }} disabled={guestsRoomsChildrenNumber === 4}>+</button>
                                       </div>
                                    </div>
                                    {/* <div className="child-age-wrapper" ref={parent}>
                                       {
                                          childAdding(guestsRoomsChildrenNumber).map((i) => {
                                             return <div className="child-age-inner" key={i}>
                                                <span className='title'>Enter age</span>
                                                <div className="counter-wrapper">
                                                   <button type='button' onClick={(e) => decreaseChildAge(e, i)}>-</button>
                                                   <input type="number" className="child-age" maxLength={2} onKeyDown={(event) => { ageHandleChange(event) }} placeholder='0' />
                                                   <button type='button' onClick={(e) => increaseChildAge(e, i)}>+</button>
                                                </div>
                                             </div>
                                          })
                                       }
                                    </div> */}
                                 </div>
                                 <div className="list-item">
                                    <div className="item-wrapper">
                                       <div className="item-content">
                                          <span className='title'>Rooms</span>
                                       </div>
                                       <div className="item-counter">
                                          <button type='button' onClick={() => setRoomsNumber((prev) => prev -= 1)} disabled={roomsNumber === 1}>-</button>
                                          <span className='count-text'>{roomsNumber}</span>
                                          <button type='button' onClick={() => setRoomsNumber((prev) => prev += 1)} disabled={roomsNumber === 6}>+</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                     }

                  </div>
               </ul>
            </div>

            {/* BODY DROPDOWN SECTION */}
            <div className="body-dropdown-section">

               {/* SECTiON WRAPPER Desktop */}
               <div className="section-wrapper-desktop">

                  {/* GOING TO SECTION */}
                  <div className="going_to-section">

                     {/* GOING TO */}
                     <div className="going_to" onClick={(e) => e.stopPropagation()}>
                        <button type='button'>Going to
                           <label htmlFor="going-to-input"></label>
                           <span>Baku</span>
                        </button>
                     </div>
                  </div>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DateRangePicker
                        disablePast
                        label="Advanced keyboard"
                        value={value}
                        showToolbar={false}
                        inputFormat="DD-MM-YYYY"
                        onChange={(newValue) => {
                           if (newValue[1] !== null) {
                              if (new Date(newValue[0].toString()).getDay() === new Date(newValue[1].toString()).getDay()) {
                                 if (new Date(newValue[0].toString()).getDate() === new Date(newValue[1].toString()).getDate())
                                    newValue[1] = newValue[1].add(1, 'day');
                              }
                           }
                           setValue(newValue);
                           localStorage.setItem('cin', GetDate(newValue[0]));
                           if (newValue[1] !== null || newValue[1] !== undefined) {
                              localStorage.setItem('cout', GetDate(newValue[1]));
                           }
                        }}
                        renderInput={(startProps, endProps) => (
                           <React.Fragment>
                              <div className="check_in-section">
                                 {/* CHECK IN */}
                                 <div className="check_in" onClick={(e) => { dropdownToggle === 'check in' ? setDropdownToggle(null) : setDropdownToggle('check in'); e.stopPropagation(); }}>
                                    <button type='button' className='check-in-button'>Check-in
                                       <label htmlFor="check-in"></label>
                                       <input className='check-in-input'
                                          ref={startProps.inputRef}
                                          {...startProps.inputProps}
                                          readOnly={true}
                                          id={'check-in'}
                                       />
                                    </button>
                                 </div>
                              </div>

                              {/* CHECK IN CHECK OUT SECTION */}
                              <div className="check_out-section">
                                 {/* CHECK OUT */}
                                 <div className="check_out" onClick={(e) => { dropdownToggle === 'check out' ? setDropdownToggle(null) : setDropdownToggle('check out'); e.stopPropagation(); }}>
                                    <button type='button' className='check-out-button'>Check-out
                                       <label htmlFor="check-out"></label>
                                       <input className='check-out-input'
                                          ref={endProps.inputRef}
                                          {...endProps.inputProps}
                                          readOnly={true}
                                          id={'check-out'}
                                       />
                                    </button>
                                 </div>
                              </div>

                           </React.Fragment>
                        )}
                     />
                  </LocalizationProvider>

                  <button className="search-button"
                     onClick={() => {
                        filterDetails.hotelSearchBtnClick ? filterDetails.setHotelSearchBtnClick(false) : filterDetails.setHotelSearchBtnClick(true);
                        filterDetails.setPostState(true);
                     }
                     }>
                     <svg width="14" height="14" style={{ marginTop: '4px', marginLeft: '4px' }} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.3477 11.3477L14.9998 14.9998" stroke="#101010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.78261 12.5652C9.97625 12.5652 12.5652 9.97625 12.5652 6.78261C12.5652 3.58896 9.97625 1 6.78261 1C3.58896 1 1 3.58896 1 6.78261C1 9.97625 3.58896 12.5652 6.78261 12.5652Z" stroke="#101010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </button>
               </div>

               {/* SECTiON WRAPPER TABLET */}
               <div className="section-wrapper-tablet">
                  {/* GOING TO SECTION */}
                  <div className="going_to-section">

                     {/* GOING TO */}
                     <div className="going_to" onClick={(e) => e.stopPropagation()}>
                        <button type='button'>Going to
                           <label htmlFor="going-to-input"></label>
                           <span>Baku</span>
                        </button>
                     </div>
                  </div>

                  <div className="second-section">
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                           disablePast
                           label="Advanced keyboard"
                           value={value}
                           showToolbar={false}
                           inputFormat="DD-MM-YYYY"
                           onChange={(newValue) => {
                              if (newValue[1] !== null) {
                                 if (new Date(newValue[0].toString()).getDay() === new Date(newValue[1].toString()).getDay()) {
                                    if (new Date(newValue[0].toString()).getDate() === new Date(newValue[1].toString()).getDate())
                                       newValue[1] = newValue[1].add(1, 'day');
                                 }
                              }
                              setValue(newValue);
                              localStorage.setItem('cin', GetDate(newValue[0]));
                              if (newValue[1] !== null || newValue[1] !== undefined) {
                                 localStorage.setItem('cout', GetDate(newValue[1]));
                              }
                           }}
                           renderInput={(startProps, endProps) => (
                              <React.Fragment>
                                 <div className="check_in-section">
                                    {/* CHECK IN */}
                                    <div className="check_in" onClick={(e) => {
                                       dropdownToggle === 'check in' ? setDropdownToggle(null) : setDropdownToggle('check in'); e.stopPropagation();
                                       filterDetails.setPostState(true);
                                    }}>
                                       <button type='button' className='check-in-button'>
                                          <label htmlFor="check-in-tablet"></label>
                                          <span>Check-in</span>
                                          <input className='check-in-input'
                                             ref={startProps.inputRef}
                                             {...startProps.inputProps}
                                             readOnly={true}
                                             id={'check-in-tablet'}
                                          />
                                       </button>
                                    </div>
                                 </div>

                                 {/* CHECK IN CHECK OUT SECTION */}
                                 <div className="check_out-section">
                                    {/* CHECK OUT */}
                                    <div className="check_out" onClick={(e) => { dropdownToggle === 'check out' ? setDropdownToggle(null) : setDropdownToggle('check out'); e.stopPropagation(); }}>
                                       <button type='button' className='check-out-button'>
                                          <span>Check-out</span>
                                          <label htmlFor="check-out-tablet"></label>
                                          <input className='check-out-input'
                                             ref={endProps.inputRef}
                                             {...endProps.inputProps}
                                             readOnly={true}
                                             id={'check-out-tablet'}
                                          />
                                       </button>
                                    </div>
                                 </div>
                              </React.Fragment>
                           )}
                        />
                     </LocalizationProvider>

                     <button className="search-button" onClick={() => {
                        filterDetails.hotelSearchBtnClick ? filterDetails.setHotelSearchBtnClick(false) : filterDetails.setHotelSearchBtnClick(true);
                        filterDetails.setPostState(true);
                     }
                     }>
                        <svg style={{ marginTop: '4px', marginLeft: '4px' }} width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M11.3477 11.3477L14.9998 14.9998" stroke="#101010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M6.78261 12.5652C9.97625 12.5652 12.5652 9.97625 12.5652 6.78261C12.5652 3.58896 9.97625 1 6.78261 1C3.58896 1 1 3.58896 1 6.78261C1 9.97625 3.58896 12.5652 6.78261 12.5652Z" stroke="#101010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </button>
                  </div>
               </div>

               {/* SECTiON WRAPPER TABLET */}
               <div className="section-wrapper-tablet-small">
                  {/* GOING TO SECTION */}
                  <div className="going_to-section">

                     {/* GOING TO */}
                     <div className="going_to" onClick={(e) => e.stopPropagation()}>
                        <button type='button'>Going to
                           <label htmlFor="going-to-input"></label>
                           <span>Baku</span>
                        </button>
                     </div>
                  </div>

                  <div className="second-section">
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                           disablePast
                           label="Advanced keyboard"
                           value={value}
                           showToolbar={false}
                           inputFormat="DD-MM-YYYY"
                           onChange={(newValue) => {
                              if (newValue[1] !== null) {
                                 if (new Date(newValue[0].toString()).getDay() === new Date(newValue[1].toString()).getDay()) {
                                    if (new Date(newValue[0].toString()).getDate() === new Date(newValue[1].toString()).getDate())
                                       newValue[1] = newValue[1].add(1, 'day');
                                 }
                              }
                              setValue(newValue);
                              localStorage.setItem('cin', GetDate(newValue[0]));
                              if (newValue[1] !== null || newValue[1] !== undefined) {
                                 localStorage.setItem('cout', GetDate(newValue[1]));
                              }
                           }}
                           renderInput={(startProps, endProps) => (
                              <React.Fragment>
                                 <div className="check_in-section">
                                    {/* CHECK IN */}
                                    <div className="check_in" onClick={(e) => { dropdownToggle === 'check in' ? setDropdownToggle(null) : setDropdownToggle('check in'); e.stopPropagation(); }}>
                                       <button type='button' className='check-in-button'>
                                          <span>Check-in</span>
                                          <label htmlFor="check-in-tablet-small"></label>
                                          <input className='check-in-input'
                                             ref={startProps.inputRef}
                                             {...startProps.inputProps}
                                             readOnly={true}
                                             id={'check-in-tablet-small'}
                                          />
                                       </button>
                                    </div>
                                 </div>

                                 {/* CHECK IN CHECK OUT SECTION */}
                                 <div className="check_out-section">
                                    {/* CHECK OUT */}
                                    <div className="check_out" onClick={(e) => { dropdownToggle === 'check out' ? setDropdownToggle(null) : setDropdownToggle('check out'); e.stopPropagation(); }}>
                                       <button type='button' className='check-out-button'>
                                          <span>Check-out</span>
                                          <label htmlFor="check-out-tablet-small"></label>
                                          <input className='check-out-input'
                                             ref={endProps.inputRef}
                                             {...endProps.inputProps}
                                             readOnly={true}
                                             id={'check-out-tablet-small'}
                                          />
                                       </button>
                                    </div>
                                 </div>

                              </React.Fragment>
                           )}
                        />
                     </LocalizationProvider>
                  </div>

                  <button className="search-button" onClick={() => {
                     filterDetails.hotelSearchBtnClick ? filterDetails.setHotelSearchBtnClick(false) : filterDetails.setHotelSearchBtnClick(true);
                     filterDetails.setPostState(true);
                  }
                  }>
                     Search
                  </button>
               </div>

               {/* SECTiON WRAPPER TABLET */}
               <div className="section-wrapper-mobile">
                  {/* GOING TO SECTION */}
                  <div className="going_to-section">

                     {/* GOING TO */}
                     <div className="going_to" onClick={(e) => e.stopPropagation()}>
                        <button type='button'>Going to
                           <label htmlFor="going-to-input"></label>
                           <span>Baku</span>
                        </button>
                     </div>
                  </div>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DateRangePicker
                        disablePast
                        label="Advanced keyboard"
                        value={value}
                        showToolbar={false}
                        inputFormat="DD-MM-YYYY"
                        onChange={(newValue) => {
                           if (newValue[1] !== null) {
                              if (new Date(newValue[0].toString()).getDay() === new Date(newValue[1].toString()).getDay()) {
                                 if (new Date(newValue[0].toString()).getDate() === new Date(newValue[1].toString()).getDate())
                                    newValue[1] = newValue[1].add(1, 'day');
                              }
                           }
                           setValue(newValue);
                           localStorage.setItem('cin', GetDate(newValue[0]));
                           if (newValue[1] !== null || newValue[1] !== undefined) {
                              localStorage.setItem('cout', GetDate(newValue[1]));
                           }
                        }}
                        renderInput={(startProps, endProps) => (
                           <React.Fragment>
                              <div className="check_in-section">
                                 {/* CHECK IN */}
                                 <div className="check_in" onClick={(e) => { dropdownToggle === 'check in' ? setDropdownToggle(null) : setDropdownToggle('check in'); e.stopPropagation(); }}>
                                    <button type='button' className='check-in-button'>
                                       <span>Check-in</span>
                                       <label htmlFor="check-in-mobile"></label>
                                       <input className='check-in-input'
                                          ref={startProps.inputRef}
                                          {...startProps.inputProps}
                                          readOnly={true}
                                          id={'check-in-mobile'}
                                       />
                                    </button>
                                 </div>
                              </div>

                              {/* CHECK IN CHECK OUT SECTION */}
                              <div className="check_out-section">
                                 {/* CHECK OUT */}
                                 <div className="check_out" onClick={(e) => { dropdownToggle === 'check out' ? setDropdownToggle(null) : setDropdownToggle('check out'); e.stopPropagation(); }}>
                                    <button type='button' className='check-out-button'>
                                       <span>Check-out</span>
                                       <label htmlFor="check-out-mobile"></label>
                                       <input className='check-out-input'
                                          ref={endProps.inputRef}
                                          {...endProps.inputProps}
                                          readOnly={true}
                                          id={'check-out-mobile'}
                                       />
                                    </button>
                                 </div>
                              </div>


                           </React.Fragment>
                        )}
                     />
                  </LocalizationProvider>

                  <button className="search-button" onClick={() => {
                     filterDetails.hotelSearchBtnClick ? filterDetails.setHotelSearchBtnClick(false) : filterDetails.setHotelSearchBtnClick(true);
                     filterDetails.setPostState(true);
                  }
                  }>
                     Search
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Search