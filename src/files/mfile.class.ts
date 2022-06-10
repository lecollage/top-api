export interface IMFile {
  originalname: string;
  buffer: Buffer;
}

export class MFile implements IMFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: IMFile) {
    this.buffer = file.buffer;
    this.originalname = file.originalname;
  }
}
