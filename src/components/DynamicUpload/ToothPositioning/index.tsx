import './toothPositioning.scss';
import colors from '@theme/colors.module.scss';

import React, { InputHTMLAttributes } from 'react';
import { CustomCheckBox } from '@library/CustomCheckBox';
import Typography from '@library/Typography';

interface ToothPositioningProps extends InputHTMLAttributes<HTMLInputElement> {
    selectedTooths: string[];
    notation: 'FDI' | 'Universal';
    error?: string;
}

export const ToothPositioning: React.FC<ToothPositioningProps> = ({ error, notation, selectedTooths, ...rest }) => {
    return (
        <>
            <div className="tooth-positioning">
                <div className="left">
                    <Typography type="h2" weight="semibold" text="R" color={colors.Gray3} className="left-title" />
                    <div className="top">
                        <CustomCheckBox
                            style={{
                                borderRadius: '10px',
                                height: '30px',
                                width: '30px',
                            }}
                            label=""
                            {...rest}
                            options={(notation === 'Universal' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['18', '17', '16', '15', '14', '13', '12', '11']).map(item => ({
                                label: item,
                                value: item,
                            }))}
                            checkedValues={Array.isArray(selectedTooths) && selectedTooths.length > 0 ? selectedTooths : []}
                        />
                    </div>
                    <div className="bottom">
                        <CustomCheckBox
                            options={(notation === 'Universal' ? ['32', '31', '30', '29', '28', '27', '26', '25'] : ['48', '47', '46', '45', '44', '43', '42', '41']).map(item => ({
                                label: item,
                                value: item,
                            }))}
                            {...rest}
                            style={{
                                borderRadius: '10px',
                                height: '30px',
                                width: '30px',
                            }}
                            checkedValues={Array.isArray(selectedTooths) && selectedTooths.length > 0 ? selectedTooths : []}
                            label={''}
                        />
                    </div>
                </div>
                <hr />
                <div className="right">
                    <Typography type="h2" weight="semibold" text="L" color={colors.Gray3} className="right-title" />
                    <div className="top">
                        <CustomCheckBox
                            {...rest}
                            style={{
                                borderRadius: '10px',
                                height: '30px',
                                width: '30px',
                            }}
                            options={(notation === 'Universal' ? ['9', '10', '11', '12', '13', '14', '15', '16'] : ['21', '22', '23', '24', '25', '26', '27', '28']).map(item => ({
                                label: item,
                                value: item,
                            }))}
                            label=""
                            checkedValues={Array.isArray(selectedTooths) && selectedTooths.length > 0 ? selectedTooths : []}
                        />
                    </div>
                    <div className="bottom">
                        <CustomCheckBox
                            options={(notation === 'Universal' ? ['24', '23', '22', '21', '20', '19', '18', '17'] : ['31', '32', '33', '34', '35', '36', '37', '38']).map(item => ({
                                label: item,
                                value: item,
                            }))}
                            label=""
                            style={{
                                borderRadius: '10px',
                                height: '30px',
                                width: '30px',
                            }}
                            {...rest}
                            checkedValues={Array.isArray(selectedTooths) && selectedTooths.length > 0 ? selectedTooths : []}
                        />
                    </div>
                </div>
            </div>
            {error && <Typography type="caption" weight="light" text={error} as="small" color="red" id="error-message" />}
        </>
    );
};
