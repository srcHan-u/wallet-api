import { crud } from '../database/crud';
import {User} from './docModel';

// receives object of methods from crud.js
export default crud(User);