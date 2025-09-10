import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { EvmModule } from './evm/evm.module';
import { CosmosModule } from './cosmos/cosmos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EvmModule,
    CosmosModule,
  ],
  providers: [AppService],
})
export class AppModule {}
