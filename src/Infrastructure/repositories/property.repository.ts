import { PropertyEntity } from "@core/entities/property.entity";
import { IPropertyRepository } from "@core/interfaces/property-repository.interface";
import { prisma } from "@infrastructure/database/prisma/prisma.client";
import { PropertyPersistenceMapper } from "@infrastructure/mappers/property-persistence.mapper";
import { PropertyVerificationStatus } from "@prisma/client";
import { PropertyNotFoundError } from "@shared/errors/property-errors";
import { injectable } from "tsyringe";

@injectable()
export class PropertyRepository implements IPropertyRepository{
    async create(entity: PropertyEntity): Promise<PropertyEntity> {
        const data = PropertyPersistenceMapper.toPersistence(entity)
        const result = await prisma.property.create({
            data,
        })
        return PropertyPersistenceMapper.toEntity(result)
    }
    async findById(id: string): Promise<PropertyEntity | null> {
        const requiredProperty = await prisma.property.findUnique({
            where:{id}
        })
        if(!requiredProperty){
            return null
        }
        return PropertyPersistenceMapper.toEntity(requiredProperty)
    }
    async findByOwnerId(ownerId: string): Promise<PropertyEntity[]> {
        const ownersProperty = await prisma.property.findMany({
            where:{
                ownerId
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        return ownersProperty.map(PropertyPersistenceMapper.toEntity)
    }
    async findPending(): Promise<PropertyEntity[]> {
        const pendingProperties =  await prisma.property.findMany({
            where:{
                status:PropertyVerificationStatus.PENDING_APPROVAL
            },
            orderBy:{
                createdAt:'desc'
            }
        })
        return pendingProperties.map(PropertyPersistenceMapper.toEntity)
    }
    async update(entity: PropertyEntity): Promise<PropertyEntity> {
        const data =  PropertyPersistenceMapper.toPersistence(entity)

        const updatedResult =  await prisma.property.update({
            where:{
                id:entity.id
            },
            data
        })
        return PropertyPersistenceMapper.toEntity(updatedResult)
    }
    async unlist(id: string): Promise<void> {
        const property = await this.findById(id)
        if(!property)throw new PropertyNotFoundError()
        property.unlist() //entity method
        await this.update(property)
    }
}