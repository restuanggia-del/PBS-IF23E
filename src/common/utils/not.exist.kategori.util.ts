import { HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

export const NotExistKategori = async (id: number, prisma: PrismaService) => {
  const data = await prisma.kategori.findUnique({
    where: { id: id },
  });

  if (!data) {
    throw new NotFoundException({
      success: false,
      message: process.env.DATA_NOT_FOUND,
      metadata: {
        status: HttpStatus.NOT_FOUND,
      },
    });
  }

  return data;
};
