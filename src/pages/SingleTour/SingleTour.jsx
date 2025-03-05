import { React, useEffect, useState } from 'react';
import $ from 'jquery';
import './singletour.scss';

///IMPORT COMPONENT
import Navbar from '../../components/Navbar/Navbar';

import OnMapImage from '../../assets/iac-congress-map.png';

const SingleTour = () => {

   const [tour, setTour] = useState(null);

   useEffect(() => {
      const tourID = new URLSearchParams(window.location.search).get('id');
      localStorage.setItem('tourID', tourID);
      GetTour(tourID);
   }, [])

   function GetTour() {
      $.ajax({
         method: 'GET',
         url: `https://monkigo.com/app/v1/iac2023/social/tour`,
         data: { token: localStorage.getItem('token'), id: localStorage.getItem('tourID') },
         success: (content) => {
            if (content.result.status === true) {
               if (content.result.data !== null) {
                  setTour(content.data[0]);
               }
            }
         }
      });
   }

   return (
      <div className="single-tour-section">
         {/* <!-- Begin:: Navbar --> */}
         <Navbar />
         {/* <!-- End  :: Navbar --> */}

         {/* <!-- Begin:: Section Banner --> */}
         <section className="section-banner">
            <div className={`section-banner__img s${tour?.info[0]?.id}`} style={{
               backgroundImage: `url(https://cdn.monkigo.com/tours/${tour?.info[0]?.id}/1.jpg)`
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
                     <h2>{tour?.info[0].name}</h2>
                  </div>

                  <div className="reserve-button">
                     <button onClick={() => { window.location.href = `/tour-checkout?id=${localStorage.getItem('tourID')}` }} type='button'>Reserve ${tour?.info[0].price}</button>
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
                        <li>Duration: <span>{tour?.info[0].duration}</span></li>
                        <li>Date: <span>{tour?.eventDate}</span></li>
                        <li>Time: <span>{tour?.info[0].time}</span></li>
                        <li>Number of people in the group: <span>{tour?.info[0].numberOfPeople}</span></li>
                        <li>Meeting point: <span>Congress Venue</span></li>
                        <li>Included: <span>{tour?.info[0].included}</span></li>
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

                  <p>{tour?.info[0].desc}</p>
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
                        tour?.info[0].planning.map((p, i) => (
                           <li>{p.time} - <span>{p.content}</span></li>
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
                        tour?.info[0].img.map((img, i) => (
                           <img key={i} src={`https://cdn.monkigo.com/tours/${tour?.info[0]?.id}/${img}`} alt="social tour" />
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