import React from 'react';
import Close from '@assets/icons/close.svg';
import Image from 'next/image';

export const AttachedImages = React.memo(({ images, removeImage }: { images: File[]; removeImage: (index: number) => void }) => {
    return (
        <div className="attached-images">
            {Array.isArray(images) &&
                images.map((image: File, index) => {
                    return (
                        <div className="image" key={index}>
                            <Image key={index} src={URL.createObjectURL(image)} alt={`Attached Image ${index}`} width={60} height={60} />
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
