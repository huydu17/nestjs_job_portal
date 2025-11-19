/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary.response';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `job_portal/${folderName}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadMultipleFile(
    files: Express.Multer.File[],
    folderName: string,
  ): Promise<CloudinaryResponse[]> {
    return Promise.all(files.map((file) => this.uploadFile(file, folderName)));
  }

  remove(public_id: string) {
    return cloudinary.uploader.destroy(public_id);
  }
}
