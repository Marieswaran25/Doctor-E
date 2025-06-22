import './defaultPrompts.scss';

import React from 'react';
import Drag from '@assets/icons/drag.svg';
import Typography from '@library/Typography';

type DefaultPromptsProps = {
    prompts: string[];
    sendPrompt: (prompt: string) => void;
};

export const DefaultPrompts: React.FC<DefaultPromptsProps> = ({ prompts, sendPrompt }) => {
    return (
        <div className="default-prompts-wrapper">
            {Array.isArray(prompts) &&
                prompts.map((prompt, index) => (
                    <div className="default-prompt" key={index} onClick={() => sendPrompt(prompt)}>
                        <Drag />
                        <Typography type="p3" weight="light" text={prompt} color="#254156" as="p" />
                    </div>
                ))}
        </div>
    );
};
