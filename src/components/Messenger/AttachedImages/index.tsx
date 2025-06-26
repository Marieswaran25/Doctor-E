import './attachedImages.scss';

import React from 'react';
import Close from '@assets/icons/close.svg';
import Typography from '@library/Typography';
import Image from 'next/image';

export const AttachedImages = React.memo(({ images, removeImage, style }: { images: File[]; removeImage: (index: number) => void; style?: React.CSSProperties }) => {
    return (
        <div className="attached-images" style={style}>
            {Array.isArray(images) &&
                images.map((image: File, index) => {
                    return (
                        <div className="image" key={index}>
                            <Image key={index} src={URL.createObjectURL(image)} alt={`Attached Image ${index}`} width={60} height={60} />
                            <div className="description">
                                <Typography type="caption" weight="regular" text={image.name} color={'#254156'} as="p" />
                                <Typography type="caption" weight="light" text={`${Math.floor(image.size / 1024)} KB`} color={'#254156'} as="span" />
                            </div>
                            <Close
                                onClick={() => {
                                    removeImage(index);
                                }}
                            />
                        </div>
                    );
                })}
        </div>
    );
});
AttachedImages.displayName = 'AttachedImages';
