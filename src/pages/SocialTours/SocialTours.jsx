import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import './socialtours.scss';

////IMPORT IMAGES
import Banner from '../../assets_concierge/images/template/banner/banner.png';
import ArrowBottomBlack from '../../assets_concierge/images/other/icon/arrow-bottom-accordion-black.svg';
import Navbar from '../../components/Navbar/Navbar';
import { config } from '../../config';
import { formatDate } from '../../utils';

const baseURL = config.baseURL;

const SocialTours = () => {
   const [accordionActive, setAccordionActive] = useState(null);
   const [tour, setTour] = useState(null);

   useEffect(() => {
      GetTours();
   }, [])

   function GetTours() {
      $.ajax({
         method: 'GET',
         url: `${baseURL}/app/v1/tours`,
         success: (content) => {
            if (content.result.status === true) {
               if (content.data !== null) {
                  setTour(content.data);
               }
            }
         }
      });
   }

   return (
      <div className="social-tours-section">
         {/* <!-- Begin:: Navbar --> */}
         <Navbar />
         {/* <!-- End  :: Navbar --> */}

         {/* <!-- Begin:: Section Banner --> */}
         <section className="section-banner">
            <div className="section-banner__img">
               <img src={Banner} className="img-fluid" alt="banner" />
            </div>
         </section>
         {/* <!-- End  :: Section Banner --> */}

         {/* <!-- Begin:: Section Activities --> */}
         <section className='section-activities'>
            <div className="section-activities-inner">
               <div className="section-header">
                  <h2>Social & Technical Tours</h2>
               </div>

               <div className="section-activities-body">
                  {/* <!-- Begin:: Area Information --> */}
                  <div className="activities-information-area">
                     <div className="area-header-title">
                        <span>Information</span>
                     </div>

                     <div className="single-information-wrapper">
                        <span><span style={{ fontFamily: 'Circular_Medium', color: '#101010' }}>Important Notice:</span> you must be registered to the congress and will need your participant number to book your tickets for Activities and Excursions.<br /><br />

                           The accessibility of each visit is described below under each activity. Kindly contact <a href="mailto:hospitality@iac2023.org">hospitality@iac2023.org</a> if you need more information or if you request special assistance.</span>
                     </div>
                  </div>
                  {/* <!-- End:: Area Information --> */}

                  {/* <!-- Begin:: Program Information --> */}
                  <div className="activities-program-area">
                     <div className="area-header-title">
                        <span>Program</span>
                     </div>

                     <div className="activities-program-accrodion-wrapper">

                        {
                           tour && tour.map((t, i) => (

                              <div className="single-accordion-wrapper" key={i}>
                                 <div className="single-accordion-header" onClick={() => accordionActive === i ? setAccordionActive(null) : setAccordionActive(i)}>
                                    <span>{formatDate(t.eventDate)}</span>
                                    <img src={ArrowBottomBlack} style={{ transform: accordionActive === i ? 'rotate(180deg)' : 'rotate(0)' }} alt="" />
                                 </div>

                                 <div className={accordionActive === i ? 'single-accordion-body activities-accordion-times-active' : 'single-accordion-body activities-accordion-times-disable'}>
                                    <div className="times-wrapper">
                                       <ul>
                                          {
                                             t.info && t.info.map((info, j) => (
                                                <li key={j}>{info.time} — <a href={`/tour?id=${info.id}`}>{info.name}</a></li>
                                             ))
                                          }
                                       </ul>
                                    </div>
                                 </div>
                              </div>
                           ))
                        }        
                     </div>
                  </div>
                  {/* <!-- End:: Program Information --> */}

                  {/* <!-- Begin:: Trending Information --> */}
                  <div className="activities-trending-area">
                     <div className="area-header-title">
                        <span>Selected for you</span>
                     </div>

                     <div className="all-tours-wrapper">
                        <a href="/tour?id=1"><div className="single-tour-container">
                           <div className="tour-image">
                              <img src="https://cdn.monkigo.com/tours/10a778ea57b94a96b2c1e2c327c04135/1.jpg" alt="" />
                           </div>
                           <div className="tour-name">
                              <span>Old City Walking Tour</span>
                           </div>
                        </div></a>
                        <a href="/tour?id=2"><div className="single-tour-container">
                           <div className="tour-image">
                              <img src="https://cdn.monkigo.com/tours/79ca9b8b134f48a2ad7cbfc9cd766073/1.jpg" alt="" />
                           </div>
                           <div className="tour-name">
                              <span>Fire-worshipping Heritage Tour</span>
                           </div>
                        </div></a>
                        <a href="/tour?id=3"><div className="single-tour-container">
                           <div className="tour-image">
                              <img src="https://cdn.monkigo.com/tours/308435f97a8843538634f65a14a2005b/1.jpg" alt="" />
                           </div>
                           <div className="tour-name">
                              <span>Ancient Gobustan & Mud Volcanoes Tour</span>
                           </div>
                        </div></a>                       
                     </div>
                  </div>
                  {/* <!-- End:: Trending Information --> */}

                  {/* <!-- Begin:: Footer --> */}
                  <footer>
                     <div className="copyright">
                        <span>Copyright © 2023 Monkigo. All rights reserved.</span>
                     </div>

                     <div className="terms-of-use">
                        <div><span>Terms of Use</span> <span className='dot'>·</span> <span>Product by <a href="https://onveiv.com/" target={'_blank'}>Onveiv.</a></span></div>
                     </div>
                  </footer>
                  {/* <!-- End:: Footer --> */}
               </div>
            </div>
         </section>
         {/* <!-- End  :: Section Activities --> */}
      </div>
   )
}

export default SocialTours