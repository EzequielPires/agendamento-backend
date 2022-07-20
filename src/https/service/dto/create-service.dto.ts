export class CreateServiceDto {
    title: string;
    description: string;
    photo?: string;
    price: number;
    duration: number;
    status?: boolean;
}
