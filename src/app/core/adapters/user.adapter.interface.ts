import { User } from '../models/user';

/**
 * Interfaz para adaptadores que transforman DTOs a User.
 *
 * Todos los adaptadores de usuario deben implementar esta interfaz
 * para garantizar compatibilidad con el método adaptWithErrorHandling.
 */
export type UserAdapter<T> = {
  /**
   * Transforma un DTO de tipo T al modelo User unificado.
   *
   * @param dto - Objeto DTO a transformar
   * @returns Usuario transformado
   * @throws Error si los datos son inválidos
   */
  adapt(dto: T): User;
};
