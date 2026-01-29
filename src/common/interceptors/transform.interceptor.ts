import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from '../interfaces/response.interface';

// Definimos una interfaz para la respuesta estándar no paginada
export interface StandardResponse<T> {
  success: boolean;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T> | (PaginatedResponse<T> & { success: boolean })
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<
    StandardResponse<T> | (PaginatedResponse<T> & { success: boolean })
  > {
    return next.handle().pipe(
      map((data) => {
        // Verificamos si la data cumple con la estructura de PaginatedResponse
        if (this.isPaginated(data)) {
          return {
            success: true,
            ...data,
          };
        }

        // Respuesta estándar
        return {
          success: true,
          data: data as T,
        };
      }),
    );
  }

  // Type Guard para verificar si la respuesta es paginada sin usar any
  private isPaginated(data: unknown): data is PaginatedResponse<T> {
    const d = data as PaginatedResponse<T>;
    return d && Array.isArray(d.data) && !!d.meta;
  }
}
