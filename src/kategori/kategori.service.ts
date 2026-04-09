import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class KategoriService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKategoriDto: CreateKategoriDto) {
    const nama_filter = createKategoriDto.nama
      .trim()
      .replace(/\s/g, '')
      .toLowerCase();

    const exist = await this.prisma.kategori.findFirst({
      where: {
        nama_filter: nama_filter,
      },
    });

    if (exist) {
      throw new ConflictException({
        success: false,
        massage: 'Data kategori sudah ada!',
        metadata: {
          status: HttpStatus.CONFLICT,
        },
      });
    }

    await this.prisma.kategori.create({
      data: {
        nama: createKategoriDto.nama,
        nama_filter: nama_filter,
      },
    });

    return {
      success: true,
      message: 'Data kategori berhasil ditambahkan!',
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
        message: 'Data kategori tidak ditemukan!',
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
      const data = await this.prisma.kategori.findUnique({
        where: { id: id },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data kategori tidak ditemukan!',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

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
        message: 'Parameter / Slug UD Harus Angka!',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async update(id: number, updateKategoriDto: UpdateKategoriDto) {
    try {
      const data = await this.prisma.kategori.findUnique({
        where: { id: id },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data kategori tidak ditemukan!',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      const nama_filter = (updateKategoriDto.nama ?? '')
        .trim()
        .replace(/\s/g, '')
        .toLowerCase();

      await this.prisma.kategori.update({
        where: { id: id },
        data: {
          nama: updateKategoriDto.nama,
          nama_filter: nama_filter,
        },
      });
      return {
        success: true,
        message: 'Data kategori berhasil diupdate!',
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
        message: 'Parameter / Slug UD Harus Angka!',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.kategori.findUnique({
        where: { id: id },
      });

      if (!data) {
        throw new NotFoundException({
          success: false,
          message: 'Data kategori tidak ditemukan!',
          metadata: {
            status: HttpStatus.NOT_FOUND,
          },
        });
      }

      await this.prisma.kategori.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'Data kategori berhasil dihapus!',
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
        message: 'Parameter / Slug UD Harus Angka!',
        metadata: {
          status: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }
}
