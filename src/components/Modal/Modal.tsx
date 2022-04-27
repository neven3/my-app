import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

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
        onRequestClose={close}
        style={{ content: { maxWidth: '500px', margin: 'auto' }}}
    >
        {children}
        <button onClick={close}>Cancel</button>
    </ReactModal>
);

export default Modal;
