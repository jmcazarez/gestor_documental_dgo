import { ItemMenuModel } from 'services/item-menu.model';

export class GrupoMenuModel {
    id: string;
    title: string;
    type: string;
    children: ItemMenuModel[];
}
