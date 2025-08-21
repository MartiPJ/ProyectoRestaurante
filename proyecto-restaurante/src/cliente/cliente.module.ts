import {Module} from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import cliente from './entities/cliente.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/auth/jwt.guard';


@Module({
    imports:[TypeOrmModule.forFeature([cliente])],
    controllers: [ClienteController],
    providers: [ClienteService],
    exports: [ClienteService],
})
export class ClienteModule {}