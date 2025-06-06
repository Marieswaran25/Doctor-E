'use client';
import './messenger.scss';

import React from 'react';
import Send from '@assets/icons/send.svg';
import { Button } from '@library/Button';
export const Messenger = ({ sendMessage }: { sendMessage: (message: string) => void }) => {
    const [inputMessage, setInputMessage] = React.useState('');

    const handleSendmessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(inputMessage);
        setInputMessage('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };
    return (
        <form className="messenger" onSubmit={handleSendmessage}>
            <input type="text" placeholder="Type your message here" value={inputMessage} onChange={handleInputChange} />
            <Button label="" backgroundColor={'#658192'} leftIcon={Send} backgroundColorOnHover={'#254156'} id="send-btn" type="submit" />
        </form>
    );
};
