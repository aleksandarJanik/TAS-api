import { ApiProperty } from "@nestjs/swagger";

export class DeleteResult {
  /** Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined. */
  @ApiProperty({ type: Boolean })
  acknowledged: boolean;
  /** The number of documents that were deleted */
  @ApiProperty({ type: Number })
  deletedCount: number;
}
