import { ResponsePaginatedDto } from 'src/common/response-paginated.dto-default';
import { Books } from '../entities/books.entity';

export class FindAllBookResDto extends ResponsePaginatedDto<Books> {}
