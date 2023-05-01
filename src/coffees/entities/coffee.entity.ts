import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as GraphQLTypes from 'src/graphql-types';
import { Flavor } from './flavor.entity';

@Entity('coffee')
export class Coffee implements GraphQLTypes.Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees)
  flavors?: Flavor[];
}
