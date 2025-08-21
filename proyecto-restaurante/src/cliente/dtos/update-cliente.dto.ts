import { PartialType } from '@nestjs/mapped-types';
import CreateClienteDto from './create-cliente.dto';

class UpdateClienteDto extends PartialType(CreateClienteDto){
    
}
export default UpdateClienteDto;