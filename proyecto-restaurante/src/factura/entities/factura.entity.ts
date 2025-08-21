import OrdenPlato from 'src/orden_plato/entities/orden_plato.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';


@Entity('factura')
class Factura {
  @PrimaryGeneratedColumn()
  id_factura: number;

  @ManyToOne(() => OrdenPlato, (ordenPlato) => ordenPlato.factura, { eager: true })
  @JoinColumn({ name: 'id_ordenPlato' })
  ordenPlato: OrdenPlato;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'varchar', length: 45 })
  nombre_cliente: string;

  @Column({ type: 'int' })
  nit: number;
}export default Factura;
