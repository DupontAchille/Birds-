import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { LocationsService } from './locations.service'
import { Location } from './entities/location.entity'
import { CreateLocationInput } from './dto/create-location.input'
import { UpdateLocationInput } from './dto/update-location.input'
import { ClientMessage, MessageTypes } from 'src/entities/ClientMessage'

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Mutation(() => Location)
  createLocation(
    @Args('createLocationInput') createLocationInput: CreateLocationInput,
  ): Promise<Location> {
    return this.locationsService.create(createLocationInput)
  }

  @Query(() => [Location], { name: 'locations' })
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll()
  }

  @Query(() => Location, { name: 'location' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Location> {
    return this.locationsService.findOne(id)
  }

  @Mutation(() => Location)
  updateLocation(
    @Args('updateLocationInput') updateLocationInput: UpdateLocationInput,
  ): Promise<Location> {
    return this.locationsService.update(updateLocationInput)
  }

  @Mutation(() => Location)
  async removeLocation(
    @Args('id', { type: () => String }) id: string,
  ): Promise<ClientMessage> {
    const deleted = await this.locationsService.remove(id)
    if (deleted.affected <= 1)
      return {
        type: MessageTypes.success,
        message: 'Location deleted',
        statusCode: 200,
      }

    return {
      type: MessageTypes.error,
      message: 'Delete action went very wrong.',
      statusCode: 400,
    }
  }
}
