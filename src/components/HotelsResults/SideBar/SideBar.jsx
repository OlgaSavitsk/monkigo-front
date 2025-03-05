import React, { useState, useEffect, useRef } from 'react';
import './sidebar.scss';

///Import Components
import $ from 'jquery';
import Slider from '@mui/material/Slider';

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

///IMPORT IMAGES
import Map from '../../../assets/hotels-sidebar/map.png';
import ArrowBottomBlack from '../../../assets/hotels-sidebar/arrow-bottom-black.png';
import ArrowTopBlack from '../../../assets/hotels-sidebar/arrow-top-black.png';
import BirdSign from '../../../assets/hotels-sidebar/bird-sign.png';
import Star from '../../../assets/hotels-sidebar/star.png';
import Search from '../../../assets/hotels-sidebar/search.svg';

///IMPORT AUTO ANIMATE
import autoAnimate from '@formkit/auto-animate';

const SideBar = ({ filterDetails, allHotels }) => {

   const [hotelName, setHotelName] = useState(false);
   const [hotelNameInputDisable, setHotelNameInputDisable] = useState(true);
   const [hotelNameSearchBtn, sethotelNameSearchBtn] = useState(false);
   const [hotelNameFiltering, setHotelNameFiltering] = useState(false);
   const [changingPrice, setChangingPrice] = useState([]);
   const middlePrice = 20;
   const [changingStars, setChangingStars] = useState({
      one: filterDetails.starRating.one,
      two: filterDetails.starRating.two,
      three: filterDetails.starRating.three,
      four: filterDetails.starRating.four,
      five: filterDetails.starRating.five
   });

   ///AUTO ANIMATE
   const parent = useRef(null);

   useEffect(() => {
      parent.current && autoAnimate(parent.current)
   }, [parent]);


   const hotelNameHandleChange = (e) => {
      const { value } = e.target;
      setHotelName(value);

      if (value !== '') {
         setHotelNameInputDisable(false);
      } else {
         setHotelNameInputDisable(true);
      }
   }

   useEffect(() => {
      $('body').on('click', () => {
         filterDetails.setPopularityDropdownActive(false);
      });
   }, []);

   useEffect(() => {
      setChangingPrice([filterDetails.priceValue.length > 0 ? filterDetails.priceValue[0] : null, filterDetails.priceValue.length > 0 ? filterDetails.priceValue[1] : null])
   }, [filterDetails.priceValue])

   function valueLabelFormat(value) {
      let scaledValue = value;

      return `$${scaledValue}`;
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

   function starLoop(length) {
      let count = [];
      for (let i = 0; i < length; i++) {
         count.push(i);
      }
      return count;
   }

   return (
      <div className="hotels-results-sidebar">
         <div className="locations-area">
            {
               allHotels !== null || allHotels !== undefined ?
                  <h3>Locations</h3>
                  :
                  <Skeleton variant="rounded" width={'89px'} height={'24px'} style={{ marginBottom: '24px' }} />
            }

            {
               allHotels !== null || allHotels !== undefined ?
                  <div className="locations-inner">
                     <img src={Map} alt="" />
                     <button type='button' className='see-locaation' onClick={() => window.location.href = '/map'}>
                        On Map
                     </button>
                  </div>
                  :
                  <Skeleton variant="rounded" width={'100%'} height={'200px'} style={{ borderRadius: '16px' }} />
            }

         </div>
         <div className="sidebar-filters" ref={parent}>
            {
               allHotels !== null || allHotels !== undefined ?
                  <div className="filters-header" onClick={() => filterDetails.filter === false ? filterDetails.setFilter(true) : filterDetails.setFilter(false)}>
                     <h3>Filters</h3>
                     {filterDetails.filter === false ?
                        <img src={ArrowBottomBlack} alt="" />
                        :
                        <img src={ArrowTopBlack} alt="" />
                     }
                  </div>
                  :
                  <Skeleton variant="rounded" width={'100%'} height={'24px'} />
            }
            {
               filterDetails.filter === true &&

               <div className="filters-body">

                  <div className="price-area">
                     {
                        allHotels !== null || allHotels !== undefined ?
                           <h3>Price for a night</h3>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'20px'} style={{ marginBottom: '48px' }} />
                     }

                     {
                        allHotels !== null || allHotels !== undefined ?
                           <Slider
                              step={10}
                              min={filterDetails.newPriceValue[0]}
                              max={filterDetails.newPriceValue[1]}
                              value={[changingPrice[0], changingPrice[1]]}
                              onChange={changeRange}
                              onChangeCommitted={() => { filterDetails.setPriceValue([changingPrice[0], changingPrice[1]]); filterDetails.setPostState(true) }}
                              valueLabelDisplay="on"
                              valueLabelFormat={valueLabelFormat}
                              disableSwap
                           />
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'20px'} />
                     }
                  </div>

                  <div className="star-rating-area">
                     {
                        allHotels !== null || allHotels !== undefined || allHotels.length > 0 ?
                           <h3>Star rating</h3>
                           :
                           <Skeleton variant="rounded" width={'81px'} height={'20px'} style={{ marginBottom: '25px' }} />
                     }


                     <div className="checkbox-list-wrapper">
                        <ul>
                           {
                              allHotels !== null || allHotels !== undefined || allHotels.length > 0 ?
                                 <li onClick={() => {
                                    filterDetails.starRating.five === false ?
                                       filterDetails.setStarRating({ ...filterDetails.starRating, five: true }) :
                                       filterDetails.setStarRating({ ...filterDetails.starRating, five: false });

                                    filterDetails.starRating.five === false ? setChangingStars({ ...changingStars, five: true }) : setChangingStars({ ...changingStars, five: false })
                                    filterDetails.setPostState(true);
                                 }
                                 }
                                 >
                                    <div className="checkbox" style={{ background: filterDetails.starRating.five === false ? '#fff' : '#274DE0', border: filterDetails.starRating.five === false ? '1px solid #E5E5E5' : 'none' }}>
                                       {
                                          filterDetails.starRating.five === true ?
                                             <img src={BirdSign} alt="" />
                                             :
                                             null
                                       }
                                    </div>
                                    {
                                       starLoop(5).map((i) => {
                                          return <img key={i} src={Star} alt="star" />
                                       })
                                    }
                                 </li>
                                 :
                                 <Skeleton variant="rounded" width={'94px'} height={'15px'} style={{ marginBottom: '17px' }} />
                           }

                           {
                              allHotels !== null || allHotels !== undefined ?
                                 <li onClick={() => {
                                    filterDetails.starRating.four === false ?
                                       filterDetails.setStarRating({ ...filterDetails.starRating, four: true }) :
                                       filterDetails.setStarRating({ ...filterDetails.starRating, four: false });

                                    filterDetails.starRating.four === false ? setChangingStars({ ...changingStars, four: true }) : setChangingStars({ ...changingStars, four: false })
                                    filterDetails.setPostState(true);
                                 }}>
                                    <div className="checkbox" style={{ background: filterDetails.starRating.four === false ? '#fff' : '#274DE0', border: filterDetails.starRating.four === false ? '1px solid #E5E5E5' : 'none' }}>
                                       {
                                          filterDetails.starRating.four === true ?
                                             <img src={BirdSign} alt="" />
                                             :
                                             null
                                       }
                                    </div>
                                    {
                                       starLoop(4).map((i) => {
                                          return <img key={i} src={Star} alt="star" />
                                       })
                                    }
                                 </li>
                                 :
                                 <Skeleton variant="rounded" width={'80px'} height={'15px'} style={{ marginBottom: '17px' }} />
                           }

                           {
                              allHotels !== null || allHotels !== undefined ?
                                 <li onClick={() => {
                                    filterDetails.starRating.three === false ?
                                       filterDetails.setStarRating({ ...filterDetails.starRating, three: true }) :
                                       filterDetails.setStarRating({ ...filterDetails.starRating, three: false });

                                    changingStars.three === false ? setChangingStars({ ...changingStars, three: true }) : setChangingStars({ ...changingStars, three: false })
                                    filterDetails.setPostState(true);
                                 }}>
                                    <div className="checkbox" style={{ background: filterDetails.starRating.three === false ? '#fff' : '#274DE0', border: filterDetails.starRating.three === false ? '1px solid #E5E5E5' : 'none' }}>
                                       {
                                          filterDetails.starRating.three === true ?
                                             <img src={BirdSign} alt="" />
                                             :
                                             null
                                       }
                                    </div>
                                    {
                                       starLoop(3).map((i) => {
                                          return <img key={i} src={Star} alt="star" />
                                       })
                                    }
                                 </li>
                                 :
                                 <Skeleton variant="rounded" width={'66px'} height={'15px'} style={{ marginBottom: '17px' }} />
                           }

                           {
                              allHotels !== null || allHotels !== undefined ?
                                 <li onClick={() => {
                                    filterDetails.starRating.two === false ?
                                       filterDetails.setStarRating({ ...filterDetails.starRating, two: true }) :
                                       filterDetails.setStarRating({ ...filterDetails.starRating, two: false });

                                       filterDetails.setPostState(true);
                                    // stars.two === false ? setStars({ ...stars, two: true}) : setStars({ ...stars, two: false });
                                 }}>
                                    <div className="checkbox" style={{ background: filterDetails.starRating.two === false ? '#fff' : '#274DE0', border: filterDetails.starRating.two === false ? '1px solid #E5E5E5' : 'none' }}>
                                       {
                                          filterDetails.starRating.two === true ?
                                             <img src={BirdSign} alt="" />
                                             :
                                             null
                                       }
                                    </div>
                                    {
                                       starLoop(2).map((i) => {
                                          return <img key={i} src={Star} alt="star" />
                                       })
                                    }
                                 </li>
                                 :
                                 <Skeleton variant="rounded" width={'50px'} height={'15px'} style={{ marginBottom: '17px' }} />
                           }

                           {
                              allHotels !== null || allHotels !== undefined ?
                                 <li onClick={() => {
                                    filterDetails.starRating.one === false ?
                                       filterDetails.setStarRating({ ...filterDetails.starRating, one: true }) :
                                       filterDetails.setStarRating({ ...filterDetails.starRating, one: false });

                                       filterDetails.setPostState(true);
                                    // stars.one === false ? setStars({ ...stars, one: true}) : setStars({ ...stars, one: false });
                                 }}>
                                    <div className="checkbox" style={{ background: filterDetails.starRating.one === false ? '#fff' : '#274DE0', border: filterDetails.starRating.one === false ? '1px solid #E5E5E5' : 'none' }}>
                                       {
                                          filterDetails.starRating.one === true ?
                                             <img src={BirdSign} alt="" />
                                             :
                                             null
                                       }
                                    </div>
                                    {
                                       starLoop(1).map((i) => {
                                          return <img key={i} src={Star} alt="star" />
                                       })
                                    }
                                    <span>or without star rating</span>
                                 </li>
                                 :
                                 <Skeleton variant="rounded" width={'174px'} height={'15px'} style={{ marginBottom: '17px' }} />

                           }


                        </ul>
                     </div>
                  </div>

                  <div className="hotel-name-area">
                     {
                        allHotels !== null || allHotels !== undefined ?
                           <h3>Hotel name</h3>
                           :
                           <Skeleton variant="rounded" width={'88px'} height={'20px'} style={{ marginBottom: '25px' }} />
                     }

                     {
                        allHotels !== null || allHotels !== undefined ?
                           <div className="input-area">
                              <input
                                 className='hotel-name-search-input'
                                 type="text"
                                 placeholder='Enter hotel name...'
                                 onChange={hotelNameHandleChange}
                              />
                              {
                                 hotelNameFiltering === false ?
                                    <div className="dropdown-button">
                                       <button type='button' className="save-button" onClick={
                                          (e) => {
                                             setHotelNameFiltering($('.hotel-name-search-input').val() === '' ? false : true);
                                             filterDetails.setSideBarHotelNameBtn($('.hotel-name-search-input').val());
                                             filterDetails.setPostState(true);
                                          }

                                       }>
                                          <img src={Search} style={{ position: 'relative', top: '2px', left: '1px' }} alt="" />
                                       </button>
                                    </div>
                                    :
                                    <div className="reset-filter-btn" onClick={(e) => {
                                       $('.hotel-name-search-input').val(''); 
                                       setHotelNameFiltering(false);
                                       filterDetails.setPostState(true);
                                       filterDetails.setSideBarHotelNameBtn('');
                                    }}>
                                       <svg width="15" height="15" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M7.59714 1.70857C7.81963 1.48608 7.81964 1.12535 7.59714 0.902857V0.902857C7.37465 0.680365 7.01392 0.680365 6.79143 0.902857L4.70711 2.98718C4.31658 3.3777 3.68342 3.3777 3.29289 2.98718L1.20857 0.902858C0.98608 0.680366 0.625349 0.680365 0.402857 0.902857V0.902857C0.180365 1.12535 0.180365 1.48608 0.402857 1.70857L2.48718 3.79289C2.8777 4.18342 2.8777 4.81658 2.48718 5.20711L0.402858 7.29143C0.180366 7.51392 0.180365 7.87465 0.402857 8.09714V8.09714C0.625349 8.31964 0.98608 8.31964 1.20857 8.09714L3.29289 6.01282C3.68342 5.6223 4.31658 5.6223 4.70711 6.01282L6.79143 8.09714C7.01392 8.31963 7.37465 8.31964 7.59714 8.09714V8.09714C7.81964 7.87465 7.81964 7.51392 7.59714 7.29143L5.51282 5.20711C5.1223 4.81658 5.1223 4.18342 5.51282 3.79289L7.59714 1.70857Z" fill="#fff" />
                                       </svg>
                                    </div>
                              }

                           </div>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'60px'} />

                     }


                  </div>
               </div>
            }
         </div>
      </div>
   )
}

export default SideBar