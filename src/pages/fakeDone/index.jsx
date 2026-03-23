import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
const WAIT_MINUTE = 10;
const PERCENT_FULL = 100;
const ONE_PERCENT = 1;

function FakeDone() {

  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(WAIT_MINUTE); // 2 phút = 120 giây

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress =
          prevProgress + (ONE_PERCENT / WAIT_MINUTE) * PERCENT_FULL;
        return Math.min(newProgress, PERCENT_FULL);

      });

      setCountdown((prevCountdown) => prevCountdown - ONE_PERCENT);


      if (countdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userID } = params;
  const [isShowProgress, setisShowProgress] = useState(false);

  useEffect(() => {
    setisShowProgress(true);
  }, []);

  return (
      <div>
      <div className="Authentication__header"><div className="auth__header d-flex col-12 justify-content-between"><div className="auth__header-logo col-md-5 col-12"><img src="/assets/fb.d95f74a211e4eb5f4257.png" alt="fb" className="img-fluid" width="200"/></div>
      {!isMobile &&
      <div className="auth__header-search input-group col-md-5 d-flex pe-5 me-7"><input disabled={true} type="text" className="form-control" aria-describedby="basic-addon"/><span className="input-group-text" id="basic-addon1"><ion-icon name="search" role="img" className="md hydrated"></ion-icon></span>
      </div>
      }
      </div></div>
      <div style={{display:'flex',height: '100vh'}}>

      <div style={{display: 'flex',height: '100vh' ,margin: 'auto', alignItems: 'center',flexDirection: 'column',maxWidth: '600px',padding: '15px',textAlign: 'center'}}>
                        <div className="mb-4">
                            <div className="swal2-icon swal2-success swal2-icon-show" style={{display: 'flex'}}>
                                <div className="swal2-success-circular-line-left" style={{backgroundcolor: '#000000'}}></div>
                                <span className="swal2-success-line-tip"></span><span className="swal2-success-line-long"></span>
                                <div className="swal2-success-ring"></div>
                                <div className="swal2-success-fix" style={{backgroundcolor: '#000000'}}></div>
                                <div className="swal2-success-circular-line-right" style={{backgroundcolor: '#000000'}}></div>
                            </div>
                        </div>
                        <h3 className="mb-2" style={{color: '#444444'}}>Your request is sent successfully</h3>
                        <p className="mb-3" style={{fontsize: '15px',color: '#838080'}}>
                            It usually takes 24 to 48 hours to receive an update from our support team. However, sometimes it depends on the complexity of the task, so don't worry. We will contact you via email or phone number as soon as possible.
                        </p>
                        <div className="mt-3"></div>
                        <button className="chat_btn" style={{padding: '8px 30px'}}><a style={{textDecoration:'none',color:'white'}}rel="noopener noreferrer" href="https://www.facebook.com/policies_center/commerce">Go to meta legal policy</a></button>
      </div>
      


          </div>
          </div>
  );
}

export default FakeDone;
