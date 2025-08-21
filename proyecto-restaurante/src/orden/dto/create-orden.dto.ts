import { EstadoOrden } from 'src/orden/entities/orden.entity';

export default class CreateOrdenDto {
    id_cliente: number;
    id_mesa: number;
    id_usuario: number; // Falta este campo en tu DTO actual
    estado?: EstadoOrden; // Hacerlo opcional si tiene valor por defecto
    fecha_hora?: Date; // Hacerlo opcional si se genera automáticamente
    // Los platos probablemente deberían ir en otro DTO o estructura
}
