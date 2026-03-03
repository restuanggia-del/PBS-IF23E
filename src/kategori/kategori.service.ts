import { Injectable } from '@nestjs/common';
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
    return data;
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
