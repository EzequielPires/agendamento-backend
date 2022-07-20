export class CreateClientDto {
    name: string;
    avatar?: string;
    email: string;
    password: string;
    phone: string;
    adress?: {
        city: string,
        uf: string,
        cep: string,
        nation: string,
        number: string,
        geo: {
            type: string,
            coordinates: string,
        }
    };
}
