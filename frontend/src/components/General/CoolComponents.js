import React from 'react'

function CoolSelect() {
  return (
    <div>CoolSelect</div>
  )
}
function Modal({ handleClose, show, children }) {
  let modal = 'fixed top-0 left-0 w-full h-fullbg-red-200'
  const showHideClassName = show ? `${modal} block` : `${modal} hidden`;

  return (
    <div className={showHideClassName}>
      <section className="fixed bg-white w-[80%] h-auto top-1/2 left-1/2">
        {children}
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </section>
    </div>
  );
};

export {
  CoolSelect,
  Modal
}