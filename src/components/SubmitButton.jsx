import React from "react";

import './SubmitButton.css';

export default function SubmitButton({ onClick, children }) {
    return (
        <button className="add-button" onClick={onClick}>
            {children}
        </button>
    );
}