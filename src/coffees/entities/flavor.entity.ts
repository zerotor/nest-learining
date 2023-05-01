import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as GraphQLTypes from '../../graphql-types';
import { Coffee } from './coffee.entity';

@Entity()
export class Flavor implements GraphQLTypes.Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  coffees: Coffee[];
}
