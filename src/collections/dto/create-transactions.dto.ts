import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsDateString()
  paymentDate: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  receiveName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  origin: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  paymentType: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'total debe ser un número válido con hasta 2 decimales' },
  )
  total: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  state: string;
}
