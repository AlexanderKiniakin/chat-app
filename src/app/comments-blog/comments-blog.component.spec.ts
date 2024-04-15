import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsBlogComponent } from './comments-blog.component';

describe('CommentsBlogComponent', () => {
  let component: CommentsBlogComponent;
  let fixture: ComponentFixture<CommentsBlogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsBlogComponent]
    });
    fixture = TestBed.createComponent(CommentsBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
