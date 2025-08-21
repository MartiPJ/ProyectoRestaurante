import Orden from "src/orden/entities/orden.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('mesa')
class Mesa {
    @PrimaryGeneratedColumn()
    id_mesa: number;
    @Column({ type: 'varchar', length: 45 })
    ubicacion: string;

    @Column()
    disponible: boolean;

    @OneToMany(() => Orden, (orden) => orden.mesa)
    orden: Orden[];
} export default Mesa;

