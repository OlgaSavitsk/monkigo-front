import { React, useEffect, useState } from 'react';
import $ from 'jquery';
import './singletour.scss';

///IMPORT COMPONENT
import Navbar from '../../components/Navbar/Navbar';
import { config } from '../../config';
import { formatDate } from '../../utils';

import OnMapImage from '../../assets/iac-congress-map.png';

const baseURL = config.baseURL;

const SingleTour = () => {

   const [tours, setTours] = useState(null);

   useEffect(() => {
      const tourID = new URLSearchParams(window.location.search).get('id');
      localStorage.setItem('tourID', tourID);
      GetTour(tourID);
   }, [])

   function GetTour() {
      $.ajax({
         method: 'GET',
         url: `${baseURL}/app/v1/tours`,
         data: { token: localStorage.getItem('token'), id: localStorage.getItem('tourID') },
         success: (content) => {
            if (content.result.status === true) {
               if (content.data !== null) {
                  setTours(content.data);
               }
            }
         }
      });
   }
   const tour = tours?.find(t => t.info[0].id === localStorage.getItem('tourID') );
   const tourInfo = tour ? tour.info[0] : null;
    if (!tourInfo) {
      window.location.href = '/chat'
    }

   return (
      <div className="single-tour-section">
         {/* <!-- Begin:: Navbar --> */}
         <Navbar />
         {/* <!-- End  :: Navbar --> */}

         {/* <!-- Begin:: Section Banner --> */}
         <section className="section-banner">
            <div className={`section-banner__img s${tourInfo.id}`} style={{
               backgroundImage: `url(data:image/jpeg;base64,${tourInfo.img[0]})`
            }}>               
            </div>
         </section>
         {/* <!-- End  :: Section Banner --> */}

         {/* <!-- Begin:: Single Tour Body --> */}
         <div className="single-tour-body">
            <div className="single-tour-body-inner">

               {/* <!-- Begin:: RESERVE AREA --> */}
               <div className="single-tour-reserve-area">
                  <div className="tour-name">
                     <h2>{tourInfo.name}</h2>
                  </div>

                  <div className="reserve-button">
                     <button onClick={() => { window.location.href = `/tour-checkout?id=${localStorage.getItem('tourID')}` }} type='button'>Reserve ${tourInfo.price}</button>
                  </div>
               </div>
               {/* <!-- End:: RESERVE AREA --> */}

               {/* <!-- Begin:: Area Information --> */}
               <div className="single-tour-information-area">
                  <div className="area-header-title">
                     <span>Information</span>
                  </div>

                  <div className="single-information-wrapper">
                     <ul>
                        <li>Duration: <span>{tourInfo.duration}</span></li>
                        <li>Date: <span>{tourInfo.eventDate && formatDate(tourInfo?.eventDate)}</span></li>
                        <li>Time: <span>{tourInfo.time}</span></li>
                        <li>Number of people in the group: <span>{tourInfo.numberOfPeople}</span></li>
                        <li>Meeting point: <span>Congress Venue</span></li>
                        <li>Included: <span>{tourInfo.included}</span></li>
                        <li>Language of the tour: <span>English</span></li>
                     </ul>
                  </div>
               </div>
               {/* <!-- End:: Area Information --> */}

               {/* <!-- Begin:: Area Descrıptıon --> */}
               <div className="single-tour-description-area">
                  <div className="area-header-title">
                     <span>Description</span>
                  </div>

                  <p>{tourInfo.description}</p>
               </div>
               {/* <!-- End:: Area Descrıptıon --> */}

               {/* <!-- Begin:: Area Program --> */}
               <div className="single-tour-information-area">
                  <div className="area-header-title">
                     <span>Program</span>
                  </div>

                  <div className="single-information-wrapper">
                     <ul>
                     {
                        tourInfo.planning.map((p, i) => (
                           <li key={i}>{p.time} - <span>{p.content}</span></li>
                        ))
                     }             
                     </ul>
                  </div>
               </div>
               {/* <!-- End:: Area Program --> */}

               {/* <!-- Begin:: Area Map --> */}
               <div className="single-tour-information-area">
                  <div className="area-header-title">
                     <span>On Map</span>
                  </div>

                  <div className="single-information-wrapper">
                        <img src={OnMapImage} className='tour-map' alt="monkigo" />
                  </div>
               </div>
               {/* <!-- End:: Area Map --> */}

               {/* <!-- Begin:: Gallery area --> */}
               <div className="single-tour-gallery-area">
                  <div className="area-header-title">
                     <span>Gallery</span>
                  </div>

                  <div className="gallery-wrapper">
                     {
                        tourInfo.img.map((img, i) => (
                           <img key={i} src={`data:image/jpeg;base64,${img}`} alt="social tour" />
                        ))
                     }
                  </div>
               </div>
               {/* <!-- End:: Gallery area --> */}

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
         {/* <!-- End  :: Single Tour Body --> */}

      </div>
   )
}

export default SingleTour