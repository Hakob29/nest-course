import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from "fs";
import * as path from "path"
import * as uuid from "uuid"

@Injectable()
export class FilesService {


    //CREATE FILE
    async createFile(file: Express.Multer.File): Promise<string> {
        try {
            const fileName = uuid.v4() + ".jpeg";
            const filePath = path.resolve(__dirname, "..", "static");
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch (err) {
            console.log(err.message);
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    //DELETE AUDIO AND PICTURE FILES
    async removeFile(fileName: string): Promise<void> {
        try {
            const filePath = path.resolve(__dirname, "..", "static/" + fileName);
            fs.stat(filePath, function (err, stats) {
                if (err) {
                    return console.error(err);
                }

                fs.unlink(filePath, function (err) {
                    if (err) return console.log(err);
                    console.log('audio and picture deleted successfully');
                });
            });
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
