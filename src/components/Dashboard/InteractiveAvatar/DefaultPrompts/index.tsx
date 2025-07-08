import './defaultPrompts.scss';
import colors from '@theme/colors.module.scss';

import React from 'react';
import Drag from '@assets/icons/drag.svg';
import { Button } from '@library/Button';
import Typography from '@library/Typography';

type DefaultPromptsProps = {
    prompts: {
        text: string;
        action: () => void;
        isLoading?: boolean;
    }[];
};

export const DefaultPrompts: React.FC<DefaultPromptsProps> = ({ prompts }) => {
    return (
        <div className="default-prompts-wrapper">
            {Array.isArray(prompts) &&
                prompts.map((prompt, index) => (
                    <Button
                        key={index}
                        label={<Typography type="p3" weight="light" text={prompt.isLoading ? 'Downloading file, Please wait...' : prompt.text} color={'white'} as="p" />}
                        buttonType="primary"
                        id="download-file"
                        className="default-prompt"
                        onClick={() => prompt.action()}
                        disable={prompt.isLoading}
                        backgroundColor={colors.Gray3}
                        leftIcon={!prompt.isLoading && Drag}
                        backgroundColorOnHover={colors.Gray3}
                    />
                ))}
        </div>
    );
};
