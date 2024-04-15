import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'like'
})
export class LikePipe implements PipeTransform {
  
  transform(postId: string, likedPosts: string[]): any {
    return likedPosts.find(item => item === postId) ? true : false
  }
}
