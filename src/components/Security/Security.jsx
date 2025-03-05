import React, { useEffect, useState } from 'react';
import '../../assets_concierge/styles/main.css';
import './security.scss';

////IMPORT COMPONENTS
import $ from 'jquery';
import OTPInput from "react-otp-input";

///IMPORT IMAGES
import Logo from '../../assets_concierge/images/logo/logo.svg';
import LogoIAC from '../../../src/assets/navbar-second/logo-iac2023.svg';
import VerifiedImg from '../../assets/security/images/other/icon/verified.svg';

const Security = () => {

   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [emailError, setEmailError] = useState(false);
   const [emailErrorContent, setEmailErrorContent] = useState("");
   const [passwordAtLeast8, setPasswordAtLeast8] = useState(false);
   const [passwordValid, setPasswordValid] = useState(false);
   const [registrationProgress, setRegistrationProgress] = useState('enter-email');
   const [passwordShow, setPasswordShow] = useState(false);
   const [passwordCorrect, setPasswordCorrect] = useState(false);
   const [signInPasswordCorrect, setSignInPasswordCorrect] = useState(false);
   const [signInPassword, setSignInPassword] = useState('');
   const [OTP, setOTP] = useState("");
   const [signUpDetails, setSignUpDetails] = useState({
      fName: '',
      lName: '',
      password: ''
   });
   const [fNameError, setFNameError] = useState(false);
   const [lNameError, setLNameError] = useState(false);
   const [signUpPasswordValid, setSignUpPasswordValid] = useState(false);
   const [signUpPasswordAtLeast8, setSignUpPasswordAtLeast8] = useState(false);
   const [signupErrorFlag, setSignupErrorFlag] = useState(false);
   const [verifyForgot, setVerifyForgot] = useState(false);
   const [token, setToken] = useState(null);
   const [signupfNameErrorContent, setSignupfNameErrorContent] = useState('');
   const [signuplNameErrorContent, setSignuplNameErrorContent] = useState('');


   useEffect(() => {

      License();

   }, [])

   function License() {
      if (token === null) {
         $.ajax({
            method: 'GET',
            url: 'https://monkigo.com/app/v1/license',
            dataType: 'json',
            success: (content) => {
               if (content?.result.code === 200) {
                  if (content?.data?.token !== null && content?.data?.token.trim() !== '') {
                     localStorage.clear();
                     localStorage.setItem('token', content.data.token);
                     setToken(content.data.token);
                  }
               }
            }
         });
      }
   }

   ////OTP HANDLE CHANGE
   function otpHandleChange(OTP) {
      const otpDigits = document.querySelectorAll('.inputStyle');
      $('.inputStyle').css('border', '1px solid #E5E5E5');
      for (var i = 0; i < OTP.length; i++) {
         $(otpDigits[i]).css('border', '1px solid  #274DE0');
      }
      setOTP(OTP);
   };

   const resetAllStates = () => {
      setEmail('');
      setPassword("");
      setEmailError(false);
      setEmailErrorContent("");
      setPasswordAtLeast8(false);
      setPasswordValid(false);
      setPasswordShow(false);
      setPasswordCorrect(false);
      setSignInPasswordCorrect(false);
      setSignInPassword('');
      setOTP("");
      setSignUpDetails({
         fName: '',
         lName: '',
         password: ''
      });
      setFNameError(false);
      setLNameError(false);
      setSignUpPasswordAtLeast8(false);
      setSignUpPasswordValid(false);
   }

   ////EMAIL HANDLE CHANGE
   const emailHandleChange = (event) => {
      const { value } = event.target;
      setEmail(value)
   }

   ////Password HANDLE CHANGE
   const passwordHandleChange = (event) => {
      const { value } = event.target;
      setPassword(value);
      if (value.length >= 8) {
         setPasswordAtLeast8(true);
      } else {
         setPasswordAtLeast8(false);
      }
      if (validatePassword(value)) {
         setPasswordValid(true);
      } else {
         setPasswordValid(false);
      }

      if (value.length >= 8 && validatePassword(value)) {
         setPasswordCorrect(true);
      } else {
         setPasswordCorrect(false);
      }
   }

   ///SIGN IN PASSWORD HANDLE CHANGE
   const signInPasswordHandleChange = (e) => {
      const { value } = e.target;
      setSignInPassword(value);
   }

   ////SIGN UP HANDLE CHANGE
   const signUpHandleChange = (e) => {
      const { name, value } = e.target;

      setSignUpDetails((prevent) => {
         return {
            ...prevent,
            [name]: value
         }
      });

      if (name === 'password') {
         if (e.target.value.length >= 8) {
            setSignUpPasswordAtLeast8(true);
         } else {
            setSignupErrorFlag(true);
            setSignUpPasswordAtLeast8(false);
         }
         if (validatePassword(e.target.value)) {
            setSignUpPasswordValid(true);
            setSignupErrorFlag(true);
         } else {
            setSignUpPasswordValid(false);
         }
      }
   }

   ///EMAIL VALIDATIOn
   const validateEmail = (email) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
   };

   ///Password VALIDATIOn
   const validatePassword = (password) => {
      const re = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/;
      return re.test(String(password).toLowerCase());
   };

   ///FName LName VALIDATIOn
   const validateNames = (name) => {
      const re = /^[a-zA-Z\s]*$/;
      return re.test(String(name).toLowerCase());
   };


   ///REGISTER VALIdATION
   const emailValidate = (email) => {
      if (email === "") {
         setEmailError(true);
         setEmailErrorContent("This field can't be empty");
         return false;
      } else {
         setEmailError(false);
         setEmailErrorContent("");
      }
      if (!validateEmail(email)) {
         setEmailError(true);
         setEmailErrorContent("Email address is not valid");
         return false;
      } else {
         setEmailError(false);
         setEmailErrorContent("");
      }
      return true;
   }

   /////EMAIL SUBMIT HANDLER
   const emailSubmitHandler = async (e) => {
      if (emailValidate(email)) {
         if (localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
            $.ajax({
               method: 'GET',
               url: 'https://monkigo.com/app/v1/user/exists',
               data: { token: localStorage.getItem('token'), login: email },
               dataType: 'json',
               success: (content) => {
                  if (content.result.status === false) {
                     setRegistrationProgress('sign-up');
                  } else {
                     setRegistrationProgress('enter-password');
                  }
               }
            });
         }
         else {
            License();
            window.location.href = '/auth';
         }
      }
   }

   /////Password SUBMIT HANDLER
   const passwordSubmitHandler = (e) => {
      if (passwordCorrect === true) {
         ///////////BURDA GIRIS OLUNUR
         if (localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined) {
            $.ajax({
               method: 'POST',
               url: 'https://monkigo.com/app/v1/user/password/change',
               data: { token: token, login: email, password: password, confirmpassword: password },
               dataType: 'json',
               success: (content) => {
                  if (content.result.status) {
                     $.ajax({
                        method: 'POST',
                        url: 'https://monkigo.com/app/v1/signin?token=' + token,
                        data: { login: email, password: password },
                        dataType: 'json',
                        success: (content) => {
                           if (content.result.status === true) {
                              if (content.result.error === false) {
                                 localStorage.setItem('user', JSON.stringify(content.data));
                                 window.location.href = '/chat';
                              }
                           }
                           else {
                              window.location.href = '/chat';
                           }
                        }
                     });
                  }
               },
               error: (jqXHR) => {
               }
            });
         }
         else {

            License();
            window.location.href = '/auth';
         }

      }
   }

   /////Password SUBMIT HANDLER KEY PRESS
   const passwordHandleKeyPress = (e) => {
      if (e.keyCode === 13) {
         passwordSubmitHandler();
      }
   }

   /////EMAIL HANDLE KEY PRESS
   const emailHandleKeyPress = (e) => {
      if (e.keyCode === 13) {
         emailSubmitHandler();
      }
   }

   ////VERIFY RESET PASSWORD HANDLE CHANGE
   const verifySubmitHandler = () => {
      $.ajax({
         method: 'GET',
         url: 'https://monkigo.com/app/v1/user/password/verfication/check',
         data: { token: token, code: OTP },
         dataType: 'json',
         success: (content) => {
            if (content.result.status) {
               if (verifyForgot === true) {
                  setRegistrationProgress('create-new-password');
               } else {
                  setRegistrationProgress('congrats')
                  setTimeout(() => {
                     window.location.href = '/chat';
                  }, 3000)
               }
            }
            else {
               $('.inputStyle').css('border', '1px solid #d32f2f');
            }
         }
      });

   }

   /////Verify Password HANDLE KEY PRESS
   const verifyPasswordHandleKeyPress = (e) => {

      if (e.keyCode === 13) {
         verifySubmitHandler();
      }
   }

   /////SIGN IN PASSWORD HANDLER
   const signInPasswordHandler = () => {

      $.ajax({
         method: 'POST',
         url: 'https://monkigo.com/app/v1/signin?token=' + localStorage.getItem('token'),
         data: { login: email, password: signInPassword },
         dataType: 'json',
         success: (content) => {
            if (content.result.status === true) {
               if (content.result.error === false) {
                  localStorage.setItem('user', JSON.stringify(content.data));
                  setSignInPasswordCorrect(false);
                  window.location.href = '/chat';
               }
            }
            else {
               setSignInPasswordCorrect(true);
            }
         }
      });
   }

   /////Sign IN Password HANDLE KEY PRESS
   const signInPasswordHandleKeyPress = (e) => {
      if (e.keyCode === 13) {
         signInPasswordHandler();
      }
   }

   //////SIGN UP SUBMIT HANDLER
   const signUpSubmitHandler = () => {
      var errorFlags = [];
      if (signUpDetails.fName === "") {
         setFNameError(true);
         setSignupfNameErrorContent('Required fields')
         errorFlags.push(true);
      } else {
         setFNameError(false);
         errorFlags.push(false);
      }

      if (signUpDetails.lName === "") {
         setLNameError(true);
         setSignuplNameErrorContent('Required fields')
         errorFlags.push(true);
      } else {
         setLNameError(false);
         errorFlags.push(false);
      }

      if (signUpDetails.fName && validateNames(signUpDetails.fName) === false) {
         setFNameError(true);
         setSignupfNameErrorContent('Only letters allowed')
         errorFlags.push(true);
      }
      else {
         errorFlags.push(false);
      }

      if (signUpDetails.lName && validateNames(signUpDetails.lName) === false) {
         setLNameError(true);
         setSignuplNameErrorContent('Only letters allowed')
         errorFlags.push(true);
      }
      else {
         errorFlags.push(false);
      }

      for (var i = 0; i < errorFlags.length; i++) {
         if (errorFlags[i] === false) {
            setSignupErrorFlag(true);
            break;
         }
         setSignupErrorFlag(false);
      }

      if ((signUpDetails.fName !== '' && validateNames(signUpDetails.fName)) &&
         (signUpDetails.lName !== '' && validateNames(signUpDetails.lName)) &&
         (signUpDetails.password.length >= 8 && validatePassword(signUpDetails.password))) {

         $.ajax({
            method: 'POST',
            url: '/app/v1/signup?token=' + token,
            data: {
               email: email,
               firstname: signUpDetails.fName,
               lastname: signUpDetails.lName,
               password: signUpDetails.password,
               confirmpassword: signUpDetails.password
            }, dataType: 'json',
            success: (content) => {
               if (content.result.status) {
                  setVerifyForgot(false);
                  setRegistrationProgress('verify');
                  if (content.data !== null) {
                     localStorage.setItem('user', JSON.stringify(content.data));
                  }
               }
            }
         });
      }
   }

   /////Sign UP SUBMIT HANDLER
   const signUpSubmitHandlerKeyPress = (e) => {
      if (e.keyCode === 13) {
         signUpSubmitHandler();
      }
   }

   function SendEmail() {
      $.ajax({
         method: 'GET',
         url: 'https://monkigo.com/app/v1/user/password/forgot',
         data: { token: token, login: email },
         dataType: 'json',
         success: (content) => {
            if (content.result.status)
               setRegistrationProgress('verify');
         }
      });
   }

   return (
      <div className="security-wrapper">
         {/* <!-- Begin:: Header --> */}
         <header className="header">
            <div className="wrapper">
               <div className="header-holder">
                  <div className="header-brand">
                     <a href="https://iac.monkigo.com/chat" className="header-brand__logo">
                        <img src={Logo} className="img-fluid" alt="logo" />
                     </a>
                     <span className="logo-divider">X</span>
                     <a href="#" className="header-brand__logo">
                        <img src={LogoIAC} className="img-fluid" alt="logo" />
                     </a>
                  </div>
               </div>
            </div>
         </header>
         {/* <!-- End  :: Header --> */}

         <div className="modal show" id="modal-auth">

            <div className="registration_image_wrapper">

               <div className="registration_image_cover_wrapper">

                  <div className="background_image_main"></div>
                  <img src={require('../../assets_concierge/images/security/main-responsive.jpg')} className='background_image_main_resposive' alt="" />

                  <div className="modal_container_wrapper">
                     <div className="modal-container" data-size="sm">
                        {
                           registrationProgress === 'enter-email' ?

                              // <!-- Begin:: Step 1: Login -->

                              <div className="form-holder">
                                 <div className="modal-header">
                                    <h4 className="modal-header__title">Enter your e-mail address to continue</h4>
                                 </div>
                                 <div className="modal-body">
                                    <div className="form-field">
                                       <label className="form-label">E-mail address</label>
                                       <input
                                          type="email"
                                          className='form-control'
                                          style={{ borderColor: emailError === false ? '#E5E5E5' : '#d32f2f' }}
                                          placeholder="E-mail"
                                          autoComplete='username'
                                          onChange={(e) => emailHandleChange(e)}
                                          onKeyDown={(e) => emailHandleKeyPress(e)}
                                       />
                                       {
                                          emailError === true ?
                                             <span className="form-error">{emailErrorContent}</span>
                                             :
                                             null
                                       }
                                    </div>
                                    <button className="btn btn-fluid btn-primary m-t-16" onClick={emailSubmitHandler}>Continue</button>
                                 </div>
                              </div>

                              : registrationProgress === 'enter-password' ?

                                 // <!-- Begin:: Step 2: Login -->

                                 <div className="form-holder">
                                    <div className="modal-header">
                                       <span className="modal-header__action">
                                          <span className="modal-header__action__btn icon-chevron-left" onClick={() => { setRegistrationProgress('enter-email'); resetAllStates() }}></span>
                                       </span>
                                       <h4 className="modal-header__title">Enter password to log in</h4>
                                    </div>
                                    <div className="modal-body">
                                       <div className="form-field has-icon">
                                          <input type={passwordShow === false ? 'password' : 'text'} className="form-control" placeholder="Password" autoFocus
                                             onChange={(e) => signInPasswordHandleChange(e)}
                                             onKeyDown={(e) => signInPasswordHandleKeyPress(e)}
                                             autoComplete='current-password'
                                          />
                                          <span
                                             className={passwordShow === true ? 'field-icon clickable icon-eye-off' : 'field-icon clickable icon-eye'}
                                             onClick={() => passwordShow === false ? setPasswordShow(true) : setPasswordShow(false)}
                                          ></span>
                                          {
                                             signInPasswordCorrect === true ?
                                                <span className="form-error">Password is not correct</span>
                                                :
                                                null
                                          }
                                       </div>
                                       <div className="forgot-password text-right m-t-16 m-b-16">
                                          <a href="#" className="link font-weight-medium" onClick={() => { setVerifyForgot(true); SendEmail(); }}>Forgot your password?</a>
                                       </div>
                                       <button className="btn btn-fluid btn-primary" onClick={() => signInPasswordHandler()}>Continue</button>
                                       <div className="form-note text-center m-t-32">By continuing, you agree to the <a href="https://iac.monkigo.com/terms-conditions" className="link">Terms of Service</a>.</div>
                                    </div>
                                 </div>

                                 : registrationProgress === 'verify' ?

                                    // Begin :: Step 4: Verification Code

                                    <div className="form-holder">
                                       <div className="modal-header">
                                          <span className="modal-header__action">
                                             <span className="modal-header__action__btn icon-chevron-left" onClick={() => { setRegistrationProgress('enter-email'); resetAllStates() }}></span>
                                          </span>
                                          <h4 className="modal-header__title">Verify it’s you</h4>
                                          <p className="modal-header__subtitle">We’ve sent a 6-digits code to you. Please check your e-mail adress and fill the box below.</p>
                                       </div>
                                       <div className="modal-body">
                                          <div className="otp-form-list">
                                             <OTPInput
                                                onChange={otpHandleChange}
                                                isInputNum={true}
                                                value={OTP}
                                                inputStyle="inputStyle"
                                                numInputs={6}
                                                shouldAutoFocus={true}
                                                className={'otp-form-list__item'}
                                                onKeyDown={() => verifyPasswordHandleKeyPress()}
                                             />
                                          </div>
                                          <button className="btn btn-fluid btn-primary m-t-32" onClick={() => verifySubmitHandler()}>Verify</button>
                                          <div className="form-note text-right m-t-24">Did not receive? <a href="#" className="link font-weight-medium">Resend code</a></div>
                                       </div>
                                    </div>

                                    // End:: Step 4: Verification Code

                                    : registrationProgress === 'create-new-password' ?

                                       // Begin:: Step 5: Create New Password

                                       <div className="form-holder">
                                          <div className="modal-header">
                                             <span className="modal-header__action">
                                                <span className="modal-header__action__btn icon-chevron-left" onClick={() => { setRegistrationProgress('enter-email'); resetAllStates() }}></span>
                                             </span>
                                             <h4 className="modal-header__title">Create a new password.</h4>
                                          </div>
                                          <div className="modal-body">
                                             <div className="form-field has-icon">
                                                <input type={passwordShow === false ? 'password' : 'text'} className="form-control" autoComplete='new-password' placeholder="Create a password"
                                                   onChange={(e) => passwordHandleChange(e)}
                                                   onKeyDown={(e) => passwordHandleKeyPress(e)}
                                                />
                                                <span
                                                   className={passwordShow === true ? 'field-icon clickable icon-eye-off' : 'field-icon clickable icon-eye'}
                                                   onClick={() => passwordShow === false ? setPasswordShow(true) : setPasswordShow(false)}
                                                ></span>
                                                <div className="password-control m-t-16 m-b-32">
                                                   <span className={passwordAtLeast8 === false ? 'password-control-rule' : 'password-control-rule checked'}>at least 8 characters</span>
                                                   <span className={passwordValid === false ? 'password-control-rule' : 'password-control-rule checked'}>include letters and numbers</span>
                                                </div>
                                             </div>
                                             <button className="btn btn-fluid btn-primary m-t-20" onClick={(e) => passwordSubmitHandler(e)}>Continue</button>
                                          </div>
                                       </div>
                                       // End Step 5: Create New Password

                                       : registrationProgress === 'sign-up' ?

                                          // Begin:: Step 3: Register

                                          <div className="form-holder">
                                             <div className="modal-header">
                                                <span className="modal-header__action">
                                                   <span className="modal-header__action__btn icon-chevron-left" onClick={() => { setRegistrationProgress('enter-email'); resetAllStates() }}></span>
                                                </span>
                                                <h4 className="modal-header__title">Enter details to sign up</h4>
                                                <p className="modal-header__subtitle">Creating an account gives you chance to saving your details and more.</p>
                                             </div>
                                             <div className="modal-body">
                                                <div className="form-field m-b-12">
                                                   <input type="text" className="form-control" placeholder="First name" name='fName' autoComplete='off' onChange={(e) => signUpHandleChange(e)} onKeyDown={(e) => signUpSubmitHandlerKeyPress(e)} autoFocus />
                                                   {
                                                      fNameError === true ?
                                                         <span className="form-error">{signupfNameErrorContent}</span>
                                                         :
                                                         null
                                                   }
                                                </div>
                                                <div className="form-field m-b-12">
                                                   <input type="text" className="form-control" placeholder="Last name" autoComplete='off' name='lName' onChange={(e) => signUpHandleChange(e)} onKeyDown={(e) => signUpSubmitHandlerKeyPress(e)} />
                                                   {
                                                      lNameError === true ?
                                                         <span className="form-error">{signuplNameErrorContent}</span>
                                                         :
                                                         null
                                                   }
                                                </div>
                                                <div className="form-field has-icon">
                                                   <input type={passwordShow === false ? 'password' : 'text'} className="form-control" placeholder="Create a password" autoComplete='off' name='password' onChange={(e) => signUpHandleChange(e)} onKeyDown={(e) => signUpSubmitHandlerKeyPress(e)} />
                                                   <span
                                                      className={passwordShow === true ? 'field-icon clickable icon-eye-off' : 'field-icon clickable icon-eye'}
                                                      onClick={() => passwordShow === false ? setPasswordShow(true) : setPasswordShow(false)}
                                                   ></span>
                                                </div>
                                                <div className="password-control m-t-16 m-b-32">
                                                   <span className={signUpPasswordAtLeast8 === false ? 'password-control-rule' : 'password-control-rule checked'}>at least 8 characters</span>
                                                   <span className={signUpPasswordValid === false ? 'password-control-rule' : 'password-control-rule checked'}>include letters and numbers</span>
                                                </div>
                                                <button className="btn btn-fluid btn-primary" onClick={() => signUpSubmitHandler()}>Continue</button>
                                             </div>
                                          </div>

                                          // End:: Step 3: Register

                                          : registrationProgress === 'congrats' ?

                                             // Begin:: Step 6: Congratulations

                                             <div className="form-holder">
                                                <div className="form-status">
                                                   <div className="form-status__icon">
                                                      <img src={VerifiedImg} className="img-fluid" alt="icon" />
                                                   </div>
                                                   <h4 className="form-status__title">Congrats, you’re verified!</h4>
                                                   <div className="form-status__subtitle">Now you've confirmed your account!</div>
                                                </div>
                                             </div>

                                             // End:: Step 6: Congratulations

                                             :

                                             null
                        }

                     </div>
                  </div>
               </div>
            </div>
         </div >
      </div>
   )
}

export default Security