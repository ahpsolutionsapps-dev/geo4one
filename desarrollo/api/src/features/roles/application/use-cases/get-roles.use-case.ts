import { RolListItemProps } from '../../domain/entities/rol-list-item';
import {
  FindRolesFilters,
  RolRepository,
} from '../../domain/repositories/rol-repository';

export class GetRolesUseCase {
  constructor(private readonly roles: RolRepository) {}

  async execute(filters: FindRolesFilters): Promise<RolListItemProps[]> {
    const rows = await this.roles.findMany(filters);
    return rows.map((row) => row.toPrimitives());
  }
}
