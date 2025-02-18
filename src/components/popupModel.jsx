import React, { useEffect, useState } from 'react' 
import { Button, Modal } from 'antd';

  export default function PopupModel({ visible, onClose, children }) {
        

        useEffect(() => {
            setIsVisible(visible);
        }, [visible]);

        const handleClose = () => {
            setIsVisible(false);
            if (onClose) {
                onClose();
            }
        };

        return (
            <Modal open={visible} onCancel={handleClose} footer={null}>
                {children}
            </Modal>
        );
    }