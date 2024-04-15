import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../interfaces/user';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(users: User[], value: string): User[] {
    return users.filter((user: User) => {
      return user.nickName?.toLowerCase().includes(value.toLowerCase());      
    });
  }
}
