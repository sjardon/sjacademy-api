import { SetMetadata } from '@nestjs/common';

export const SectionArgName = (sectionArgName: string) =>
  SetMetadata('sectionArgName', sectionArgName);
