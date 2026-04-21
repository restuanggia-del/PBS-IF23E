import { ConflictException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export const conflictKategori = async (
  nama: string,
  massage: string,
  prisma: PrismaService,
  id?: number,
) => {
  const nama_filter = nama.trim().replace(/\s/g, '').toLowerCase();

  const exist = await prisma.kategori.findFirst({
    where: {
      nama_filter: nama_filter,
      ...(id ? { NOT: { id: id } } : {}),
    },
  });

  if (exist) {
    throw new ConflictException({
      success: false,
      massage: massage,
      metadata: {
        status: HttpStatus.CONFLICT,
      },
    });
  }
  return nama_filter;
};
