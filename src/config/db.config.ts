import { registerAs } from '@nestjs/config';
import { defaultDataSource } from 'src/database/database.data-source';

export default registerAs('db', () => defaultDataSource.options);
