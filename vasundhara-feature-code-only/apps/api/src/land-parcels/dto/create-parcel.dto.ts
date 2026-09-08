import { IsNumberString, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateParcelDto {
  @IsString()
  projectId!: string;

  @IsString()
  parcelNumber!: string;

  @IsOptional()
  @IsString()
  surveyNumber?: string;

  @IsOptional()
  @IsString()
  village?: string;

  @IsOptional()
  @IsString()
  tehsil?: string;

  @IsOptional()
  @IsNumberString()
  area?: string;

  // A GeoJSON Polygon/MultiPolygon geometry object, e.g.
  // { "type": "Polygon", "coordinates": [[[lng,lat], ...]] }
  @IsOptional()
  @IsObject()
  geometry?: Record<string, unknown>;
}
