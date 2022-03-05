import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ExamModule } from "./exam/exam.module";
import { PresenceModule } from "./presence/presence.module";
import { ActivityModule } from "./activity/activity.module";
import { ClassModule } from "./classs/class.module";
import { NoteModule } from "./note/note.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".development.env",
      // envFilePath: '.production.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("DB_STRING"),
        // poolSize: 100
        // connectionName: 'main',
        // connectionFactory: async (connection: Connection) => {
        //   const AutoIncrement = AutoIncrementFactory(connection);
        //   connection.plugin(AutoIncrement, { inc_field: 'id' });y
        //   return connection;
        // },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ExamModule,
    NoteModule,
    PresenceModule,
    ActivityModule,
    ClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
