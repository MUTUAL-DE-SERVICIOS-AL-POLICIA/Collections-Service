import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export enum CollectionState {
  COINCILIADO = 'COINCILIADO',
  NO_COINCILIADO = 'NO COINCILIADO',
}

export class CreateTransactionDto {
  @IsDateString()
  paymentDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titularName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  payerName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  origin: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  paymentType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  receptionistUser: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'total debe ser un número válido con hasta 2 decimales' },
  )
  @IsPositive()
  total: number;

  @IsEnum(CollectionState)
  state: CollectionState;
}
