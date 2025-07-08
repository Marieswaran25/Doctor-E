import './transparentLoaderModal.scss';

import React from 'react';
import SpinBall from '@assets/icons/spinBall.gif';
import { Modal } from '@library/Modal';
import Image from 'next/image';

export const TransparentLoaderModal = () => {
    return (
        <Modal className="transparent-loader-modal">
            <Image src={SpinBall} alt="loader" width={50} height={50} />
        </Modal>
    );
};
