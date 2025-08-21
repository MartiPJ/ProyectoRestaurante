import OrdenPlato from "src/orden_plato/entities/orden_plato.entity";
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('plato')
class Plato {
    @PrimaryGeneratedColumn()
    id_plato: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 100 })
    descripcion: string;

    @Column()
    precio: number;

    @Column()
    disponible: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    imagen: string;


    @OneToMany(() => OrdenPlato, (ordenPlato) => ordenPlato.plato)
    ordenesPlato: OrdenPlato[];
}
export default Plato;