import React, { useEffect, useEffectEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiModalResultType } from "../utils/apiHelper";
import Modal from "./Modal";
/**
 * @component
 * @param {Object} props
 * @param {{
 * type:'error' |'warning' | 'confirm',
 * text:string,
 * title:string,
 * onConfirm:function
 * }} props.message
 * @param {function} onClose
 * @returns {JSX.Element}
 */
export default function MessageNotifier({ message, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const showEvent = useEffectEvent(() => {
    setShowModal(true);
  });
  useEffect(() => {
    if (!message) return;

    switch (message.type) {
      case apiModalResultType.error:
      case apiModalResultType.confirm:
      case apiModalResultType.info:
        showEvent();
        break;

      case apiModalResultType.warning:
        toast.warning(message.text || "هشدار");
        break;

      // case apiModalResultType.confirm:
      //   toast.success(message.text || "عملیات موفق بود");
      //   break;

      default:
        toast.info(message.text || "پیام اطلاعاتی");
        break;
    }
  }, [message]);

  const closeModal = () => {
    setShowModal(false);
    onClose?.();
  };

  if (!(message?.text?.length > 0)) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      {/* مودال ساده */}
      {showModal && (
        <Modal
          autoClose={message.type === apiModalResultType.confirm ? 8000 : 3000}
          type={message.type}
          show={showModal}
          setShow={closeModal}
        >
          <Modal.Header>{message.title ?? ""}</Modal.Header>
          <Modal.Body>{message.text}</Modal.Body>
          {message.onConfirm && (
            <Modal.Footer onConfirm={message.onConfirm}></Modal.Footer>
          )}
        </Modal>
      )}
    </>
  );
}
