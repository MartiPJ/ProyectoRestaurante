import { EstadoRol } from "../entities/usuario.entity";

export default class CreateUsuarioDto {
    nombre:string;
    password:string;
    rol:EstadoRol;
}
