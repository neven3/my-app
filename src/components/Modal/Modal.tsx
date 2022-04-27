import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

import Button from '../Button';

import './Modal.scss';

interface IModalProps {
    isOpen: boolean;
    close: () => void;
    children: ReactNode;
}

ReactModal.setAppElement('#root');

const Modal: React.FC<IModalProps> = ({ isOpen, close, children }) => (
    <ReactModal
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        isOpen={isOpen}
        className="modal"
        onRequestClose={close}
    >
        <div className="modal__content">
            {children}
        </div>
        <Button
            onClick={close}
            text="Close"
            className="modal__btn"
        />
    </ReactModal>
);

export default Modal;
