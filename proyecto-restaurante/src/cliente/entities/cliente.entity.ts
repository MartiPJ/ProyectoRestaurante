import Orden from 'src/orden/entities/orden.entity';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';

@Entity('cliente')
class cliente{
    @PrimaryGeneratedColumn()
    id_cliente: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column()
    telefono: number;

    @OneToMany(() => Orden, (orden) => orden.cliente)
    orden: Orden[];

}
export default cliente;