import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import Orden from 'src/orden/entities/orden.entity';
import Plato from 'src/plato/entities/plato.entity';
import Factura from 'src/factura/entities/factura.entity';

@Entity('orden_plato')
class OrdenPlato {
  @PrimaryGeneratedColumn()
  id_ordenPlato: number;

  @ManyToOne(() => Orden, (orden) => orden.ordenesPlatos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_orden' })
  orden: Orden;

  @ManyToOne(() => Plato, (plato) => plato.ordenesPlato, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_plato' })
  plato: Plato;

  @OneToMany(() => Factura, (factura) => factura.ordenPlato, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_factura' })
  factura: Factura;

  @Column('int')
  cantidad: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  observaciones?: string;
}

export default OrdenPlato;
