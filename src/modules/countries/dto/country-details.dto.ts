import { ApiProperty } from '@nestjs/swagger';

export class CountryDetailsDto {
  @ApiProperty({ description: 'Common name of the country' })
  name: string;

  @ApiProperty({ description: 'Population of the country' })
  population: number;

  @ApiProperty({ description: 'Area of the country in square kilometers' })
  area: number;

  @ApiProperty({ description: 'Languages spoken in the country' })
  languages: string;

  @ApiProperty({ description: 'Borders of the country' })
  borders: string[];
}
