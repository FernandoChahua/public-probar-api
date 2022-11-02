import { Builder } from '../../shared/utils/builder';
import { DateUtil } from '../../shared/utils/date-util';
import { GetBrandDto, SaveBrandDto } from './dto';
import { Brand } from './entities/brands.entity';

export class BrandsFactory {
  public static buildEntityToDto({
    id,
    title,
    description,
    status,
    createdAt,
    urlLogoLink,
  }: Brand): GetBrandDto {
    const dto = Builder<GetBrandDto>()
      .id(id)
      .title(title)
      .description(description)
      .urlLogoLink(urlLogoLink)
      .status(status)
      .createdAt(DateUtil.getDateWithTimezone(createdAt))
      .build();

    return dto;
  }

  public static buildDtoToEntity({ title, description }: SaveBrandDto): Brand {
    const brand = Builder<Brand>()
      .title(title)
      .description(description)
      .urlLogoLink('')
      .build();

    return brand;
  }
}
