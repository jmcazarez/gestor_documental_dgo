import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'menu',
        title    : 'Menú',
        type     : 'group',
        children : [
            {
                id       : 'usuarios',
                title    : 'Usuarios',
                type     : 'item',
                icon     : 'face',
                url      : '/usuarios'
            },
            // {
            //     id       : 'login',
            //     title    : 'Login',
            //     type     : 'item',
            //     icon     : 'person_outline',
            //     url      : '/login'
            // }
        ]
    }
];
