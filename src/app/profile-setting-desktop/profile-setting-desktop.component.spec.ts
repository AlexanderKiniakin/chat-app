import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingDesktopComponent } from './profile-setting-desktop.component';

describe('ProfileSettingDesktopComponent', () => {
  let component: ProfileSettingDesktopComponent;
  let fixture: ComponentFixture<ProfileSettingDesktopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSettingDesktopComponent]
    });
    fixture = TestBed.createComponent(ProfileSettingDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
