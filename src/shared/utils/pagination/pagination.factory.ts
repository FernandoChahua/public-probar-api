import { PaginationResultInterface } from './pagination.results.interface';

export class PaginationFactory {
  public static buildPaginationResult<T>(
    result: T[],
    limit: number,
    page: number,
    total: number,
  ) {
    const paginationResult = new PaginationResultInterface<T>();
    paginationResult.limit = limit;
    paginationResult.page = page;
    paginationResult.total = total;
    paginationResult.results = result;

    paginationResult.total_pages = Math.ceil(total / limit);

    return paginationResult;
  }
}
