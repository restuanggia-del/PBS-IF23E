import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class KategoriService {
  // buat konstruktor untuk menginisialisasi PrismaService
  constructor(private readonly prisma: PrismaService) {}
  create(createKategoriDto: CreateKategoriDto) {
    return 'This action adds a new kategori';
  }

  // tampilkan seluruh data kategori
  async findAll() {
    // return `This action returns all kategori`;
    // buat variabel untuk menampilkan data kategori
    const data = await this.prisma.kategori.findMany();

    // jika data kategori tidak ditemukan, maka tampilkan pesan error
    if (data.length === 0) {
      // throw new HttpException(
      //   {
      //     success: false,
      //     message: 'Data kategori tidak ditemukan!',
      //     metadata: {
      //       status: HttpStatus.NOT_FOUND,
      //       total_data: data.length,
      //     },
      //   },
      //   HttpStatus.NOT_FOUND,
      // );

      throw new NotFoundException({
        success: false,
        message: 'Data kategori tidak ditemukan!',
        metadata: {
          status: HttpStatus.NOT_FOUND,
          total_data: data.length,
        },
      });
    }

    // jika data kategori ditemukan, maka tampilkan data kategori
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

  findOne(id: number) {
    return `This action returns a #${id} kategori`;
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  remove(id: number) {
    return `This action removes a #${id} kategori`;
  }
}
