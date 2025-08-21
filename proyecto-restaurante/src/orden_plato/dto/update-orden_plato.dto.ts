import { PartialType } from '@nestjs/mapped-types';
import CreateOrdenPlatoDto from './create-orden_plato.dto';

export class UpdateOrdenPlatoDto extends PartialType(CreateOrdenPlatoDto) {}
