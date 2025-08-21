import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import Orden from "src/orden/entities/orden.entity";
export enum EstadoRol {
  ADMIN = 'admin',
  MESERO = 'mesero',
  COCINERO = 'cocinero',
  CAJERO = 'cajero',
}
@Entity('usuario')
class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario:number;

  @Column({type: 'varchar', length: 100})
  nombre:string;

  @Column({type:'varchar', default:''})
  password:string;

  @OneToMany(() => Orden, (orden) => orden.usuario)
  ordenes: Orden[];

  @Column({
    type: 'enum',
    enum: EstadoRol,
    default: EstadoRol.MESERO,
  })
  rol:EstadoRol;

  @BeforeInsert()
  async hashPassword() {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(this.password, saltOrRounds);
    this.password = hash;
  }
}export default Usuario;
