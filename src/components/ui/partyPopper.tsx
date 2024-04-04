import React from "react";
interface PartyPopperProps extends React.SVGProps<SVGAElement> {

}

function PartyPopper({className}: PartyPopperProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      className={className}
      fill="none"
      viewBox="0 0 100 100"
    >
      <path fill="#fff" d="M0 100h100V0H0v100z"></path>
    </svg>
  );
}

export default PartyPopper;