import React from "react";
import "./ButtonBright.scss";

const ButtonBright = ({children, disabled, fun}) => {
    return (
        <button onClick={()=>fun()} className="ButtonBright" disabled={!disabled}>{children}</button>
    );
};

export default ButtonBright;
