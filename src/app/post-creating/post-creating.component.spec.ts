import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreatingComponent } from './post-creating.component';

describe('PostCreatingComponent', () => {
  let component: PostCreatingComponent;
  let fixture: ComponentFixture<PostCreatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostCreatingComponent]
    });
    fixture = TestBed.createComponent(PostCreatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
