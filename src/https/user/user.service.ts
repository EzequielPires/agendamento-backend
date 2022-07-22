import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "src/entities/service.entity";
import { User } from "src/entities/user.entity";
import { Like, Repository } from "typeorm";
import { ServiceService } from "../service/service.service";
import { FindUserDTO } from "./dto/find-users.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly serviceService: ServiceService
    ) { }

    async create(body: User) {
        try {
            let user: User;
            if (body.role === 'collaborator' && !body.business) {
                throw new Error('Not found Business');
            }
            if (body.services) {
                await this.findServices(body.services).then(services => {
                    user = this.userRepository.create({
                        ...body,
                        services
                    });
                })
            } else {
                user = this.userRepository.create(body);
            }

            return {
                success: true,
                data: await this.userRepository.save(user)
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    async findAll(queryDto: FindUserDTO) {
        try {
            const query = this.userRepository.createQueryBuilder('user')
                .leftJoin('user.business', 'business')
                .leftJoinAndSelect('user.services', 'service');

            const { business, role, service, id } = queryDto;

            { business ? query.andWhere('business.id = :business', { business }) : null }
            { service ? query.andWhere('service.id = :service', { service }) : null }
            { role ? query.andWhere('user.role = :role', { role }) : null }
            { id ? query.andWhere('user.id = :id', { id }) : null }


            const users = await query.getMany();

            return {
                success: true,
                data: users
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    async findOne(id: string) {
        try {
            const user = await this.userRepository.findOne({
                relations: ['services'],
                where: { id }
            });

            if (!user) {
                throw new Error('Usuário não existe')
            }

            return {
                success: true,
                data: user
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    async findOneOrFail(email: string) {
        try {
            const business = await this.userRepository.findOneOrFail({
                relations: ['business', 'businessToManege'],
                where: { email }
            });
            return business;
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    async update(id: string, body: User) {
        try {
            const user = await this.userRepository.findOne({
                where: { id }
            });

            if (!user) {
                throw new Error("Usuário não existe.");
            }

            if (body.services) {
                await this.findServices(body.services).then(services => {
                    user.name = body.name;
                    user.phone = body.phone;
                    user.email = body.email;
                    user.role = body.role;
                    user.services = services;
                })
            } else {
                user.name = body.name;
                user.phone = body.phone;
                user.email = body.email;
                user.role = body.role;
                user.services = [];
            }


            return {
                success: true,
                data: await this.userRepository.save(user)
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    async uploadAvatar(avatar: string, user: any) {
        try {
            const userExist = await this.userRepository.findOne({
                where: {id: user}
            });

            if(!userExist) {
                throw new Error('User not found');
            }

            await this.userRepository.update({id: user}, {avatar: avatar});

            return {
                success: true,
                message: 'upload feito com sucesso!'
            }
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    async findServices(array) {
        let services: Service[] = [];
        for (const item of array) {
            await this.serviceService.findOne(String(item)).then(res => services.push(res.data));
        }
        return services;
    }

    async delete(id: string) {
        try {
            const user = await this.userRepository.findOne({
                where: {id}
            })

            if(!user) {
                throw new Error('User not found.');
            }

            await this.userRepository.delete({id});

            return {
                success: true,
                message: 'Usuário deletado com sucesso.'
            }

        } catch (error) {
            return {
                success: true,
                message: error.message
            }
        }
    }
}