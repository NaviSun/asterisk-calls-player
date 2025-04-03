import { IsDate, IsString } from "class-validator";

export class CreateAduioFileDto  {
      @IsString()
      filePath: string;
      @IsString()
      inColNumber: string;
      @IsString()
      OutColNumber: string;
      @IsString()
      fileName: string;
      @IsDate()
      createdAt: Date;
}