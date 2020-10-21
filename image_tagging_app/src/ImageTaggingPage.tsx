import React, { useEffect, useState } from 'react';
import { getImagesReq, saveImageReq } from './api/api-calls';
import Checkbox from './components/Checkbox/Checkbox';
import { useKeyPress } from './hooks/useKeyboardEvent';
import { TaggedImage } from './types/taggedImage';

interface ImageTaggingPageProps {
}


const tagLists1 = [
    [
        'person',
        'group',
        'person high risk',
        'person potential risk',
    ],
    [
        'tree',
        'bush',
        'sign',
        'straw bale',
        'barrier'
    ],
    [
        'blurry',
        'low contrast',
        'direct sunlight',
        'dirt or rain',
        'night',
        'snow',
        'useless',
        'car interior'
    ],
];

const tagLists2 = [
    [
        'person',
        'group',
        'anomaly',
    ],
    [
        'danger level low',
        'danger level medium',
        'danger level high',
    ],
    [
        'quality low',
        'quality medium',
        'quality high',
    ],
    [
        'snow',
        'rain/water',
        'dirt on windshield',
        'fog',
        'night',
    ],
];

const ImageTaggingPage: React.FC<ImageTaggingPageProps> = (props) => {

    const [selectedImage, setSelectedImage] = useState<TaggedImage>({
        image: 'vlcsnap-2020-10-09-15h34m43s306.png',
        isTagged: false,
        tags: []
    });

    const [mode, setMode] = useState<'review' | 'label'>('label')
    const [allImages, setAllImages] = useState<TaggedImage[]>([]);
    const [filteredImages, setFilterImages] = useState<TaggedImage[]>([]);
    const [imageIndex, setImageIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentTags, setCurrentTags] = useState<string[]>([]);

    const hideLabelled = mode === 'label';
    const currentImage = !isNaN(imageIndex) && filteredImages.length > 0 ? { ...filteredImages[imageIndex] } : undefined;

    const keyPressed = useKeyPress('s');

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        const filtered = hideLabelled ? allImages.filter(img => !img.isTagged) : allImages.slice();
        setFilterImages(filtered);
    }, [allImages, hideLabelled]);

    useEffect(() => {
        if (keyPressed) {
            console.log('submit by key');
            saveImage();
        }
    }, [keyPressed])

    useEffect(() => {
        if (!currentImage) {
            setCurrentTags([]);
            return;
        }
        setCurrentTags(currentImage.tags.slice());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredImages, imageIndex, mode]);

    const isTagActive = (name: string): boolean => {
        return currentTags.includes(name);
    }

    const fetchImages = async () => {
        setLoading(true);
        setError('');
        try {
            const resp = await getImagesReq();
            console.log(resp.data);
            setAllImages([...resp.data.images]);
        } catch (e) {
            setError(e.repsonse.data);
        } finally {
            setLoading(false);
        }
    }

    const saveImage = async (clear?: boolean) => {
        setLoading(true);
        setError('');
        if (!currentImage) {
            return;
        }
        if (clear) {
            currentImage.isTagged = false;
            currentImage.tags = [];
            setCurrentTags([]);
        } else {
            currentImage.isTagged = true;
            currentImage.tags = currentTags;
        }

        try {
            await saveImageReq(currentImage);
            await fetchImages();
        } catch (e) {
            setError(e.repsonse.data);
        } finally {
            setLoading(false);
        }
    }





    const controlsLabelMode = <React.Fragment>
        <span>
            {filteredImages.length.toFixed(0) + ' images remaining'}
        </span>
        <button
            className="btn btn-primary ml-3"
            onClick={() => saveImage()}
        >
            {loading ? <React.Fragment>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ml-2">Loading...</span>
            </React.Fragment> : 'Save >'}
        </button>
    </React.Fragment>;

    const controlsReviewMode = <React.Fragment>
        <div className="flex-grow-1 d-flex justify-content-center h-100 align-items-center">
            <button
                className="btn btn-secondary mr-2"
                onClick={() => {
                    setImageIndex(prev => {
                        let newValue = prev - 1;
                        if (newValue < 0) {
                            newValue = 0;
                        }
                        return newValue;
                    })
                }}
            > {'<'} </button>
            <input
                className="mr-2 h-100"
                type="number"
                min={1}
                value={imageIndex + 1}
                max={filteredImages.length}
                style={{ width: 70 }}
                onChange={(event) => {
                    let val = parseInt(event.target.value);
                    if (val < 1) {
                        val = 1;
                    } else if (val >= filteredImages.length) {
                        val = filteredImages.length;
                    }
                    setImageIndex(val - 1);
                }}
            />
            <span>{'of ' + filteredImages.length.toFixed(0)}</span>
            <button
                className="btn btn-secondary ml-2"
                onClick={() => {
                    setImageIndex(prev => {
                        let newValue = prev + 1;
                        if (newValue >= filteredImages.length) {
                            newValue = filteredImages.length - 1;
                        }
                        return newValue;
                    })
                }}
            > {'>'} </button>
        </div>
        <div>
            <button
                className="btn btn-primary mr-2"
                onClick={() => saveImage()}
            > {loading ? <React.Fragment>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ml-2">Loading...</span>
            </React.Fragment> : 'Save Changes'}</button>
            <button
                className="btn btn-warning"
                disabled={!currentImage || !currentImage.isTagged}
                onClick={() => saveImage(true)}
            > {loading ? <React.Fragment>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ml-2">Loading...</span>
            </React.Fragment> : 'Clear Tagged Status'}</button>
        </div>
    </React.Fragment>;


    const labelRow = () =>
        <React.Fragment>
            <div className="col-8 d-flex flex-column">
                <h3>Image:</h3>
                <div className="flex-grow-1 d-flex align-items-start pt-3 border-top">
                    <img
                        width="100%"
                        src={`${process.env.REACT_APP_API_BASE_URL}/assets/${filteredImages[imageIndex].image}`} alt="Img not found" />
                </div>
            </div>
            <div className="col-4">
                <h3>Tags:</h3>
                <div className=" border-top">
                    {tagLists2.map((tagList, index) =>
                        <div
                            key={index.toFixed()}
                            className="border-bottom py-2"
                        >
                            {tagList.map(tag =>
                                <Checkbox
                                    key={tag}
                                    className="py-1"
                                    id={tag}
                                    name={tag}
                                    checked={isTagActive(tag)}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            if (!currentTags.includes(tag)) {
                                                setCurrentTags(prev => [...prev, tag])
                                            }
                                        } else {
                                            setCurrentTags(prev => prev.filter(t => t !== tag));
                                        }
                                    }}
                                >
                                    {tag}
                                </Checkbox>)}
                        </div>
                    )
                    }
                </div>
            </div>

        </React.Fragment>

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col mt-4 py-3">
                    <button className="btn btn-secondary"
                        onClick={() => {
                            if (mode === 'label') {
                                setMode('review');
                            } else {
                                setImageIndex(0);
                                setMode('label');
                            }
                        }}
                    >
                        {mode === 'label' ?
                            'Use Review Mode' : 'Use Labelling Mode'
                        }
                    </button>
                </div>
            </div>

            <div className="row" style={{ minHeight: 520 }}>
                {
                    filteredImages.length > 0 && !isNaN(imageIndex) ?
                        labelRow() :
                        <div className="col-12 p-3"
                        >
                            <h4>No images to label</h4>
                        </div>
                }
            </div>

            <div className="row">
                {
                    error ? <div className="col-12 p-2">
                        <div className="alert alert-danger">{error}</div>
                    </div> : null
                }
                <div className="col-12 mt-4 justify-content-center align-items-center d-flex border-bottom py-3 bg-light">
                    {mode === 'label' ?
                        controlsLabelMode : controlsReviewMode
                    }
                </div>
            </div>

        </div>
    );
};

export default ImageTaggingPage;
