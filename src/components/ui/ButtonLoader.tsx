import React from "react";

type ButtonLoaderProps = {
  onClick: () => void;
  isLoading: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  onClick,
  isLoading,
  children,
  icon,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-md transition ${
        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </span>
      )}
      <span className={`${isLoading ? "opacity-0" : "opacity-100"} flex items-center gap-2`}>
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default ButtonLoader;
