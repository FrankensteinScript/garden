import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HerbService } from './services/herb.service';
import { HerbResponseDto } from './dtos/herbResponse.dto';
import { toHerbResponseDto } from './herb.mapper';
import { HerbRequestDto } from './dtos/herbRequest.dto';

@Controller('herb')
export class HerbController {
    constructor(private readonly herbService: HerbService) {}

    @Get()
    async findAll(): Promise<HerbResponseDto[]> {
        const herbs = await this.herbService.findAll();
        return herbs.map(toHerbResponseDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<HerbResponseDto> {
        const herb = await this.herbService.findOne({ id } as any);
        return toHerbResponseDto(herb);
    }

    @Post()
    async create(@Body() dto: HerbRequestDto): Promise<HerbResponseDto> {
        const herb = await this.herbService.create(dto);
        return toHerbResponseDto(herb);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: HerbRequestDto
    ): Promise<HerbResponseDto> {
        const herb = await this.herbService.update({ id } as any, dto);
        return toHerbResponseDto(herb);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.herbService.delete({ id } as any);
    }

    @Post(':id/image')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/herbs',
                filename: (_req, file, cb) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                    cb(new Error('Only image files are allowed'), false);
                    return;
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        })
    )
    async uploadImage(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<HerbResponseDto> {
        const imageUrl = `/uploads/herbs/${file.filename}`;
        const herb = await this.herbService.update(
            { id } as any,
            { imageUrl } as any
        );
        return toHerbResponseDto(herb);
    }
}
