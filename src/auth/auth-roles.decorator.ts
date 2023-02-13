import { SetMetadata } from "@nestjs/common";


export const ROLE_KEY = 'role';

export function Role(...role: string[]) {

    return SetMetadata(ROLE_KEY, role)

}