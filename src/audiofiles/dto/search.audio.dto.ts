import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class SearchAudioFilesDto {
    @ApiProperty({
        description: 'Поиск по номеру',
        default: '10',
        required: true,
    })
    @IsString()
    phoneNumber: string;

}