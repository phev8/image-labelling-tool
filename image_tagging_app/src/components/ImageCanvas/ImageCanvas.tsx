import React, { useEffect, useRef, useState } from 'react';

import imageSrc from '../../assets/ARG18_ss02gre_pov_2800.png';

interface ImageCanvasProps {
}

interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    highLighted?: boolean;
}

const xyImgRelativeToCanvas = (x: number, y: number, imgRect: Rectangle): { x: number; y: number } => {
    return {
        x: x * imgRect.width + imgRect.x,
        y: y * imgRect.height + imgRect.y
    };
}

const dxdyImgRelativeToCanvas = (dx: number, dy: number, imgRect: Rectangle): { dx: number; dy: number } => {
    return {
        dx: dx * imgRect.width,
        dy: dy * imgRect.height
    };
}

const xyCanvasToImgRelative = (x: number, y: number, imgRect: Rectangle): { x: number; y: number } => {
    return {
        x: (x - imgRect.x) / imgRect.width,
        y: (y - imgRect.y) / imgRect.height
    };
}

const ImageCanvas: React.FC<ImageCanvasProps> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [imgBox, setImgBox] = useState<Rectangle>({ x: 0, y: 0, width: 1, height: 1 });
    const [selectionRect, setSelectionRect] = useState<Rectangle | undefined>(
        {
            x: 10, y: 56, width: 300, height: 200
        }
    );



    const drawImgRectangles = (ctx: CanvasRenderingContext2D, rectangles: Rectangle[], imgBox: Rectangle) => {
        for (const rect of rectangles) {
            const { x, y } = xyImgRelativeToCanvas(rect.x, rect.y, imgBox);
            const { dx: width, dy: height } = dxdyImgRelativeToCanvas(rect.width, rect.height, imgBox);
            console.log(rect);
            console.log(width);
            ctx.fillRect(x, y, width, height);
        }
    }


    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) {
            return;
        }

        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            //Our first draw


            // canvas.style.height = '100%';
            // canvas.height = img.height as number;
            // get the scale
            const imgWidth = img.width as number;
            const imgHeight = img.height as number;
            console.log(`${img.width} - ${img.height}`);
            const scale = Math.min(canvas.width / imgWidth, canvas.height / imgHeight);
            // get the top left position of the image
            const x = (canvas.width / 2) - (imgWidth / 2) * scale;
            const y = (canvas.height / 2) - (imgHeight / 2) * scale;

            console.log(`x: ${x}, y: ${y}, width: ${imgWidth * scale}, height: ${imgHeight * scale}`);

            ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
            const newImgBox: Rectangle = {
                x: x,
                y: y,
                width: imgWidth * scale,
                height: imgHeight * scale
            };
            setImgBox(newImgBox);

            ctx.fillStyle = '#000000';
            ctx.beginPath()
            ctx.arc(50, 100, 20, 0, 2 * Math.PI)
            ctx.fill()

            if (selectionRect?.highLighted) {
                ctx.fillStyle = 'rgba(223, 120, 96, 0.9)';
            } else {
                ctx.fillStyle = 'rgba(223, 120, 96, 0.6)';
            }

            if (selectionRect) {
                // ctx.fillRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height);
            }

            drawImgRectangles(ctx, [
                { x: 0, y: 0.2, width: 0.3, height: 0.1 },
                { x: 0.6, y: 0.7, width: 0.39, height: 0.3 },
            ], newImgBox);

        }
    }

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const { devicePixelRatio: ratio = 1 } = window
        // canvas.width = width * ratio
        // canvas.height = height * ratio
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
    }

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;
        setImage(img);
        img.onload = () => {

            draw();
        }
    }, [imageSrc])

    useEffect(() => {
        const img = new Image();
        img.src = imageSrc;

        setImage(img);


        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) {
            return;
        }

        resizeCanvas();
        window.onresize = function () {
            resizeCanvas();
            draw();
        }
        draw();


        /*const { width, height } = canvas.getBoundingClientRect();
        console.log(width);
        if (canvas.width !== width || canvas.height !== height) {
            const { devicePixelRatio: ratio = 1 } = window
            canvas.width = width * ratio
            canvas.height = height * ratio
            ctx.scale(ratio, ratio)
            return;
        }*/
        return () => {
            window.onresize = null;
        }
    }, []);

    return (
        <div style={{ width: '100%', height: '50vh' }}>
            <canvas
                ref={canvasRef}
                // width="100%"
                onClick={(event) => {
                    console.log(event.clientX);
                    console.log(event.clientY);

                }}
                onMouseDown={(event) => {
                    console.log('down');
                }}
                onMouseMove={(event) => {
                    console.log('move');
                    if (!selectionRect) {
                        return;
                    }
                    const rect = canvasRef.current?.getBoundingClientRect();
                    if (!rect) { return; }

                    const { devicePixelRatio: ratio = 1 } = window

                    // console.log(event.clientY);
                    const x = (event.clientX - rect.left) * ratio;
                    const y = (event.clientY - rect.top) * ratio;
                    console.log(x);
                    console.log(y);
                    if (x > selectionRect?.x && x < selectionRect.x + selectionRect.width &&
                        y > selectionRect?.y && y < selectionRect.y + selectionRect.height) {
                        setSelectionRect(prev => {
                            if (!prev) { return prev; }
                            prev.highLighted = true;
                            return prev;
                        })
                    } else {
                        setSelectionRect(prev => {
                            if (!prev) { return prev; }
                            prev.highLighted = false;
                            return prev;
                        })
                    }
                    const { x: x_img, y: y_img } = xyCanvasToImgRelative(x, y, imgBox);
                    console.log(x_img);
                    console.log(y_img);
                    draw();
                }}
                onMouseUp={(event) => {
                    console.log('up');
                }}
                {...props}
            ></canvas>
            {/*<img src={image} width="100%" alt="" />*/}
        </div>

    );
};

export default ImageCanvas;
