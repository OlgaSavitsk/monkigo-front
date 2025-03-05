import React, { useState, useEffect } from 'react';
import './progressbar.scss';

import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

//import images
import Sign from '../../../assets/hotel-checkout/sign.svg';
import ArrowBlackBottom from '../../../assets/hotel-checkout/arrow-bottom-black.svg';

const ProgressBar = ({ tourCheckOutData }) => {

   const navigate = useNavigate();
   const [progressBarModal, setProgressBarModal] = useState(false);

   useEffect(() => {
      if (progressBarModal !== false) {
         $('body, html').css('overflow', 'hidden')
      } else {
         $('body, html').css('overflow', '')
      }
   }, [progressBarModal])

   return (
      <div className="progressBar-wrapper">
         <div className="progressBar-modal" style={{ display: progressBarModal === true ? 'flex' : 'none' }} onClick={() => setProgressBarModal(false)}>
            <div className="progressBar-modal-inner" onClick={(e) => e.stopPropagation()}>
               <div className="progressBar-info-wrapper">
                  <div className="circle-area">
                     <div className="top-circle">
                        <img src={Sign} alt="" />
                     </div>
                     <div className="line line-1"></div>
                     <div className="middle-circle"></div>
                     <div className="line line-2"></div>
                     <div className="bottom-circle"></div>
                  </div>
                  <div className="text-area">
                     <span onClick={() => navigate('/social-tours')}>Search</span>
                     <span>Attendant details</span>
                     <span>Payment</span>
                  </div>
               </div>
               <button type='button' onClick={() => setProgressBarModal(false)}>Close</button>
            </div>
         </div>
         <div className="progressBar-wrapper-inner">
            <div className="left-circle" onClick={() => navigate('/social-tours')}>
               <img src={Sign} alt="" />
            </div>
            <div className="line line-1"></div>
            <div className="middle-circle"></div>
            <div className="line line-2"></div>
            <div className="right-circle"></div>
         </div>

         <div className="progressBar-wrapper-inner-responsive" onClick={() => setProgressBarModal(true)}>
            <div className="text-wrapper">
               <span>2 of 3</span>
               <h3>Attendant details</h3>
            </div>
            <img src={ArrowBlackBottom} alt="" />
         </div>
      </div>
   )
}

export default ProgressBar