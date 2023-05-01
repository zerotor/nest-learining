import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as GraphQLTypes from 'src/graphql-types';
import { Coffee } from './entities/coffee.entity';
import { Repository } from 'typeorm';
import { UserInputError } from 'apollo-server-express';
import { CreateCoffeeInput } from './dto/create-coffee.input';
import { UpdateCoffeeInput } from './dto/update-coffee.input';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
  ) {}

  async findAll(): Promise<Coffee[]> {
    return this.coffeeRepository.find();
  }

  async findOne(id: number): Promise<Coffee> {
    const coffee = this.coffeeRepository.findOne({ where: { id } });
    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }

    return coffee;
  }

  async create(createCoffeeInput: CreateCoffeeInput): Promise<Coffee> {
    const coffee = this.coffeeRepository.create(createCoffeeInput);
    return this.coffeeRepository.save(coffee);
  }

  async update(
    id: number,
    updateCoffeeInput: UpdateCoffeeInput,
  ): Promise<Coffee> {
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeInput,
    });

    if (!coffee) {
      throw new UserInputError(`Coffee #${id} does not exist`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number): Promise<Coffee> {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorsRepository.findOne({
      where: { name },
    });

    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorsRepository.create({ name });
  }
}
