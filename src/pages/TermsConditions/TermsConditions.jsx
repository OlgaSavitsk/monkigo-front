import React from 'react';
import './termsconditions.scss';

///IMPORT COMPONENT
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

////IMPORT IMAGES
import ArrowBackBlack from '../../assets/hotel-checkout/arrow-back-black.svg';

const TermsConditions = () => {

  const navigate = useNavigate();
  
  return (
    <section className='main-container'>
      <Navbar />
      <div className="text-wrapper">
        <div className="text-wrapper-inner">
          <div className="back-button-wrapper">
            <button onClick={() => navigate(-1)} type='button' className='back-button'><img src={ArrowBackBlack} alt="" />Back</button>
          </div>
          <h2>Terms & Conditions</h2>
          <p>
            The client / user shall be liable for the authenticity of the information provided to the system for carrying out the booking and specifically for the veracity of the credit card data. <br /><br />
            The client / user shall be liable for the email address and / or other forms of contact and for all intents and purposes shall be accepted as correct for any type of notification. <br /><br />
            The client / user authorizes the establishment/s of their choice to charge their credit card total of the booking and / or the cancellation and / or modification expenses, if applicable, as stated in the terms published on this website. <br /><br />
            Before confirming the final booking and proceeding with your payment, make sure you have chosen exactly what you want because the services to be received shall exclusively be those appearing in the confirmation. <br /><br />
            Any modification and / or cancellation of your booking must be made via the system through the localizer stated on your service voucher. <br /><br />
            The booking contract shall be understood as taking effect between the client and the establishment chosen.<br /><br />
            MONKIGO only publishes information, descriptions, prices and other data provided by the hotels, and in no way shall be liable for its veracity or accuracy, or for any other aspect. Any complaint referring to this should be made to the establishment in question. <br /><br />
            Confirmation of your automatic system-made booking is subject to the collection of your credit card payment charged by the hotel and, if this is not possible, the booking may be cancelled at any moment, following an email notification sent to the address you provided. <br /><br />
            Booking cancellation costs might arise depending on the conditions imposed by each establishment. <br /><br />
            Cancellation conditions indicated in booking system based on properly location time zone <br /><br />

            The information you provide is strictly confidential and shall be made available exclusively to the hotel/s of your choice. It shall not be used for any other purpose other than that of MONKIGO. Even so, MONKIGO cannot be held responsible for the use of this data by the establishments of your choice, and takes for granted the diligence for its use and custody.<br /><br />
            The information contained in this website might include mistakes in transcription, translation, and / or misprints of some other type, computer breakdowns, operability, and / or other similar matters and no liability shall be accepted for them. <br /><br />
            When confirming the booking, you will be requested to accept these general conditions, which shall be understood as the only ones valid and any booking and / or its modification shall be subject to them. <br /><br />
            Please be kindly reminded that every transaction will be calculated in manat (AZN). Any refund will be made based on the exchange rate at the time of purchase.<br/><br/>
            I agree to receive all related Marketing communications by email.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TermsConditions