import { ConflictException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export const conflictKategori = async (
  nama: string,
  id: number,
  massage: string,
  prisma: PrismaService,
) => {
  const nama_filter = nama.trim().replace(/\s/g, '').toLowerCase();

  const exist = await prisma.kategori.findFirst({
    where: {
      NOT: { id: id },
      nama_filter: nama_filter,
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
