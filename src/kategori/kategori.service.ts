import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKategoriDto } from './dto/create-kategori.dto';
import { UpdateKategoriDto } from './dto/update-kategori.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class KategoriService {
  // buat konstruktor untuk menginisialisasi PrismaService
  constructor(private readonly prisma: PrismaService) {}

  //buat fungsi untuk tambah data
  async create(createKategoriDto: CreateKategoriDto) {
    //return 'This action adds a new kategori';

    //buat variabel untuk filter nama kategori, agar tidak terjadi duplikasi data kategori
    const nama_filter = createKategoriDto.nama
      .trim() //spasi di awal dan akhir kata akan dihapus
      .replace(/\s/g, '') //spasi di tengah kata akan dihapus
      .toLowerCase(); //merubah huruf kecil semua

    //cek apakah data kategori sudah ada
    const exist = await this.prisma.kategori.findFirst({
      where: {
        nama_filter: nama_filter,
      },
    });

    //jika data kategori sudah ada
    if (exist) {
      throw new ConflictException({
        success: false,
        massage: 'Data kategori sudah ada!',
        metadata: {
          status: HttpStatus.CONFLICT,
        },
      });
    }

    //jika data kategori belum ada

    //simpan data kategori
    await this.prisma.kategori.create({
      data: {
        nama: createKategoriDto.nama,
        nama_filter: nama_filter,
      },
    });

    //tampilkan respon
    return {
      success: true,
      message: 'Data kategori berhasil ditambahkan!',
      metadata: {
        status: HttpStatus.CREATED,
      },
    };
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

  //buat fungsi untuk detail data
  async findOne(id: number) {
    //return `This action returns a #${id} kategori`;

    // tampilkan data kategori sesuai id
    const data = await this.prisma.kategori.findUnique({
      where: { id: id },
    });

    // jika data ketegori tidak ditemukan
    if (!data) {
      throw new NotFoundException({
        success: false,
        message: 'Data kategori tidak ditemukan!',
        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
    // jika data kategori ditemukan
    return {
      success: true,
      message: '',
      metadata: {
        status: HttpStatus.OK,
      },
      data: data,
    };
  }

  update(id: number, updateKategoriDto: UpdateKategoriDto) {
    return `This action updates a #${id} kategori`;
  }

  // buat fungsi untuk hapus data kategori
  async remove(id: number) {
    // return `This action removes a #${id} kategori`;

    // tampilkan data kategori sesuai id
    const data = await this.prisma.kategori.findUnique({
      where: { id: id },
    });

    // jika data ketegori tidak ditemukan
    if (!data) {
      throw new NotFoundException({
        success: false,
        message: 'Data kategori tidak ditemukan!',
        metadata: {
          status: HttpStatus.NOT_FOUND,
        },
      });
    }
    // jika data kategori ditemukan
    // hapus data kategori berdasarkan id
    await this.prisma.kategori.delete({
      where: { id: id },
    });
    return {
      success: true,
      message: 'Data kategori berhasil dihapus!',
      metadata: {
        status: HttpStatus.OK,
      },
      data: data,
    };
  }
}
