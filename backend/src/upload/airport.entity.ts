import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Airport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // International Air Transport Association code, 3-letter code (e.g. AMS - Schiphol)
  @Column()
  iata: string;

  // United Nations Code for Trade and Transport Locations (e.g. NLAMS (Netherlands, Amsterdam))
  @Column()
  unlocode: string;

  @Column()
  country: string;

  @Column()
  city: string;
}
