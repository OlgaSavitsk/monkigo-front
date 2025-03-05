import React, { useEffect, useState, useRef } from 'react';
import './hotelimages.scss';

///IMPORT COMPONENTS
import $ from 'jquery';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";

////IMPORT MUI
import Skeleton from '@mui/material/Skeleton';

// import required modules
import { Pagination, Navigation, Thumbs } from "swiper";

const HotelImages = ({ hotel }) => {

   const [imageWrapper, setImageWrapper] = useState('desktop');
   const [galleryToggle, setGalleryToggle] = useState(false);
   const [thumbsSwiper, setThumbsSwiper] = useState(null);
   const [galleryImageIndex, setGalleryImageIndex] = useState({
      current: 1,
      all: 0
   });

   useEffect(() => {
      if (galleryToggle !== false) {
         $('body, html').css('overflow', 'hidden')
      } else {
         $('body, html').css('overflow', '')
      }
   }, [galleryToggle])

   useEffect(() => {
      setGalleryImageIndex({ ...galleryImageIndex, all: hotel && hotel.img.length })
   }, [hotel])

   useEffect(() => {

      const settingImageWrapper = () => {
         if (window.innerWidth <= 767) {
            setImageWrapper('mobile');
         } else {
            setImageWrapper('desktop');
         }
      }
      settingImageWrapper();
      $(window).resize(() => {
         settingImageWrapper();
      });

   }, []);

   return (
      <div className="hotel-page-images-wrapper">
         {
            imageWrapper === 'desktop' ?
               <div className="hotel-page-images-wrapper-inner">
                  <div className="big-image-wrapper">
                     {
                        hotel ?
                           <div className="image-inner">
                              <div className="hotel-image" style={{ background: `url('${hotel.img[0].replace('{size}', 'x500')}')` }}>
                                 <div className="overlay-filter" onClick={() => setGalleryToggle(true)}></div>
                              </div>
                           </div>
                           :
                           <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '24px 0 0 24px' }} />

                     }

                  </div>
                  <div className="small-image-wrapper">
                     <div className="small-image-layer small-image-layer-1">
                        {
                           hotel ?
                              <div className="image-inner">
                                 <div className="hotel-image" style={{ background: `url('${hotel.img[1].replace('{size}', 'x500')}')` }}>
                                    <div className="overlay-filter" onClick={() => setGalleryToggle(true)}></div>
                                 </div>
                              </div>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '0', marginRight: '2.8%' }} />

                        }

                        {
                           hotel ?
                              <div className="image-inner">
                                 <div className="hotel-image" style={{ borderRadius: '0 24px 0 0', background: `url('${hotel.img[2].replace('{size}', 'x500')}')` }} >
                                    <div className="overlay-filter" onClick={() => setGalleryToggle(true)}></div>
                                 </div>
                              </div>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '0 24px 0 0' }} />
                        }

                     </div>

                     <div className="small-image-layer small-image-layer-2">
                        {
                           hotel ?
                              <div className="image-inner">
                                 <div className="hotel-image" style={{ background: `url('${hotel.img[3].replace('{size}', 'x500')}')` }}>
                                    <div className="overlay-filter" onClick={() => setGalleryToggle(true)}></div>
                                 </div>
                              </div>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '0', marginRight: '2.8%' }} />
                        }


                        {
                           hotel ?
                              <div className="image-inner">
                                 <div className="hotel-image" style={{ borderRadius: '0 0 24px 0', background: `url('${hotel.img[4].replace('{size}', 'x500')}')` }}>
                                    <div className="more-images-layer" onClick={() => setGalleryToggle(true)}>
                                       <div className="text-section">
                                          <h3>+{hotel?.img.length - 5}</h3>
                                          <div className="inner-text">
                                             <span>More</span>
                                             <span>Photos</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              :
                              <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '0 0 24px 0' }} />
                        }

                     </div>
                  </div>
               </div>
               :
               <div className="hotel-page-images-wrapper-inner">
                  {
                     hotel ?
                        <Swiper
                           pagination={{ dynamicBullets: true, clickable: true }}
                           loop={true}
                           speed={250}
                           modules={[Pagination]}
                           className="mySwiper"
                        >
                           {
                              hotel.img.map((i) => (
                                 <SwiperSlide key={i}>
                                    <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('${i.replace('{size}', 'x500')}')` }}></div>
                                 </SwiperSlide>
                              ))
                           }
                        </Swiper>
                        :
                        <Skeleton variant="rounded" width={'100%'} height={'100%'} style={{ borderRadius: '0' }} />
                  }

               </div>
         }

         <div className="hotel-page-gallery-modal" style={{ display: galleryToggle === true ? 'flex' : 'none' }} onClick={() => setGalleryToggle(false)}>
            <div className="hotel-page-gallery-modal-inner" onClick={(e) => e.stopPropagation()}>
               <div className="modal-header">
                  <h2>Gallery</h2>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setGalleryToggle(false)}>
                     <path d="M13.295 2.115C13.6844 1.72564 13.6844 1.09436 13.295 0.705C12.9056 0.315639 12.2744 0.315639 11.885 0.705L7.70711 4.88289C7.31658 5.27342 6.68342 5.27342 6.29289 4.88289L2.115 0.705C1.72564 0.315639 1.09436 0.315639 0.705 0.705C0.315639 1.09436 0.315639 1.72564 0.705 2.115L4.88289 6.29289C5.27342 6.68342 5.27342 7.31658 4.88289 7.70711L0.705 11.885C0.315639 12.2744 0.315639 12.9056 0.705 13.295C1.09436 13.6844 1.72564 13.6844 2.115 13.295L6.29289 9.11711C6.68342 8.72658 7.31658 8.72658 7.70711 9.11711L11.885 13.295C12.2744 13.6844 12.9056 13.6844 13.295 13.295C13.6844 12.9056 13.6844 12.2744 13.295 11.885L9.11711 7.70711C8.72658 7.31658 8.72658 6.68342 9.11711 6.29289L13.295 2.115Z" fill="#9D9D9D" />
                  </svg>
               </div>

               <div className="slider-area">
                  <Swiper
                     navigation={true}
                     thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                     onSlideChange={(e) => { setGalleryImageIndex({ ...galleryImageIndex, current: e.realIndex + 1 }); $('.swiper-slide-active .hotel-image .overlay-filter').css('background', 'rgba(255, 255, 255, 0.6)') }}
                     onSwiper={(e) => { setGalleryImageIndex({ ...galleryImageIndex, current: e.realIndex }) }}
                     modules={[Navigation, Thumbs]}
                     className="mySwiper2"
                  >
                     {
                        hotel?.img.map((i, index) => (
                           <SwiperSlide key={index}>
                              <div className="hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('${i.replace('{size}', '1024x768')}')` }}></div>
                           </SwiperSlide>
                        ))
                     }
                  </Swiper>
               </div>

               <div className="image-counter-area">
                  <span>{galleryImageIndex.current} / {galleryImageIndex.all}</span>
               </div>

               <div className="preview-slider">
                  <Swiper
                     onSwiper={setThumbsSwiper}
                     spaceBetween={10}
                     speed={250}
                     slidesPerView={'auto'}
                     slidesPerGroup={1}
                     modules={[Thumbs]}
                     watchSlidesProgress={true}
                     className="mySwiper"
                  >
                     {
                        hotel?.img.map((i, index) => (
                           <SwiperSlide key={index}>
                              <div className="hotel-image .thumb-hotel-image" style={{ background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 55.83%, rgba(0, 0, 0, 0.25) 88%), url('${i.replace('{size}', '1024x768')}')` }}>
                                 <div className="overlay-filter"></div>
                              </div>
                           </SwiperSlide>
                        ))
                     }
                  </Swiper>
               </div>
            </div>
         </div>

      </div>
   )
}

export default HotelImages