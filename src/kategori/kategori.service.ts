import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '../prisma.service';
import { NotExistKategori } from 'src/common/utils/not.exist.kategori.util';
import { conflictKategori } from 'src/common/utils/conflict-kategori.utils';

@Injectable()
export class KategoriService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKategoriDto: CreateKategoriDto) {
    const nama_filter = await conflictKategori(
      createKategoriDto.nama,
      0,
      process.env.FAILED_SAVE!,
      this.prisma,
    );

    await this.prisma.kategori.create({
      data: {
        nama: createKategoriDto.nama,
        nama_filter: nama_filter,
      },
    });

    return {
      success: true,
      message: process.env.SUCCESS_SAVE,
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
  }

  async findAll() {
    const data = await this.prisma.kategori.findMany();

    if (data.length === 0) {
      throw new NotFoundException({
        success: false,
        message: process.env.FAILED_SAVE,
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }

    return {
      success: true,
      message: '',
      metadata: {
        status: HttpStatus.OK,
        total_data: data.length,
      },
      data: data,
    };
  }

  async findOne(id: number) {
    try {
      const data = await NotExistKategori(id, this.prisma);

      return {
        success: true,
        message: '',
        metadata: {
          status: HttpStatus.OK,
        },
        data: data,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: process.env.INVALID_ID,
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async update(id: number, updateKategoriDto: UpdateKategoriDto) {
    try {
      await NotExistKategori(id, this.prisma);

      const nama_filter = (updateKategoriDto.nama ?? '')
        .trim()
        .replace(/\s/g, '')
        .toLowerCase();

      const exist = await this.prisma.kategori.findFirst({
        where: {
          NOT: { id: id },
          nama_filter: nama_filter,
        },
      });

      if (exist) {
        throw new ConflictException({
          success: false,
          massage: process.env.FAILED_UPDATE,
          metadata: {
            status: HttpStatus.CONFLICT,
          },
        });
      }

      await this.prisma.kategori.update({
        where: { id: id },
        data: {
          nama: updateKategoriDto.nama,
          nama_filter: nama_filter,
        },
      });
      return {
        success: true,
        message: process.env.SUCCESS_UPDATE,
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: process.env.INVALID_ID,
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async remove(id: number) {
    try {
      await NotExistKategori(id, this.prisma);

      await this.prisma.kategori.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: process.env.SUCCESS_DELETE,
        metadata: {
          status: HttpStatus.OK,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException({
        success: false,
        message: process.env.INVALID_ID,
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
}
