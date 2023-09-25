import axiosInstance from '../../constants/AxiosInstance';

import { API_URL, S3_BUCKET } from '../../constants/index';

export const readFile = (file, limit) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (read) => {
      if (limit > 0 && read.total > 1000000 * limit) {
        reject(`파일 크기가 ${limit}MB 이하이어야 합니다.`);
      } else {
        resolve(read);
      }
    };
  });
};

export const removeStorageFile = async (file, fileId, uploadKey, apiKey) => {
  if (!apiKey) return;

  const param = {
    id: fileId,
    tableKey: fileId,
    uploadKey,
    bucket: S3_BUCKET,
    key: file.key,
  };

  const payloadString = Object.entries(param)
    .map((e) => e.join('='))
    .join('&');

  const encURI = `${API_URL}/${apiKey}/files/${S3_BUCKET}?${payloadString}`;

  const url = encodeURI(encURI);

  await axiosInstance.delete(url);
};
