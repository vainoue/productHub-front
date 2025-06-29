import React from "react";
import { Check, X } from "lucide-react";

export default function ConfirmToast({ message, onConfirm, onCancel, closeToast }) {
    return (
        <div className="space-y-4">
            <p className="text-gray-800 dark:text-gray-200">{message}</p>
            <div className="flex space-x-3">
                <button
                    onClick={() => {
                        onConfirm();
                        closeToast();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                    <Check className="w-4 h-4" />
                    <span>Confirm</span>
                </button>
                <button 
                    onClick={() => {
                        onCancel(); 
                        closeToast();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors duration-200"
                >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                </button>
            </div>
        </div>
    );
}

