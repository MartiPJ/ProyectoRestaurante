import Mesa from 'src/mesa/entities/mesa.entity';
import Cliente from 'src/cliente/entities/cliente.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import OrdenPlato from 'src/orden_plato/entities/orden_plato.entity';
import Usuario from 'src/usuario/entities/usuario.entity';


export enum EstadoOrden {
  PENDIENTE = 'pendiente',
  EN_COCINA = 'en cocina',
  SERVIDA = 'servida',
  FACTURADA = 'facturada',
}

@Entity('orden')
class Orden {
  @PrimaryGeneratedColumn()
  id_orden: number;

  @ManyToOne(() => Mesa, (mesa) => mesa.orden)
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;

  @ManyToOne(() => Cliente, (cliente) => cliente.orden)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @OneToMany(() => OrdenPlato, (ordenPlato) => ordenPlato.orden)
  ordenesPlatos: OrdenPlato[];

  @ManyToOne(() => Usuario, (usuario) => usuario.ordenes)
  usuario: Usuario;

  @Column({
    type: 'enum',
    enum: EstadoOrden,
    default: EstadoOrden.PENDIENTE,
  })
  estado: EstadoOrden;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_hora: Date;
}

export default Orden;
