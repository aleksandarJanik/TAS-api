import { ApiProperty } from "@nestjs/swagger";

export class HttpExceptionAnotated {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;
}
