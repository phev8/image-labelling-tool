import { TaggedImage } from "../types/taggedImage";
import apiInstance from "./api";


export const getImagesReq = () => apiInstance.get<{ images: TaggedImage[] }>('/v1/images');
export const saveImageReq = (image: TaggedImage) => apiInstance.post('/v1/image', image);