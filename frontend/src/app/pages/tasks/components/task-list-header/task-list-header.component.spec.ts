import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListHeaderComponent } from './task-list-header.component';

describe('TaskListHeaderComponent', () => {
  let component: TaskListHeaderComponent;
  let fixture: ComponentFixture<TaskListHeaderComponent>;
  let authServiceMock: { logout: jasmine.Spy<jasmine.Func> };

  beforeEach(async () => {
    authServiceMock = {
      logout: jasmine.createSpy('logout'),
    };

    await TestBed.configureTestingModule({
      imports: [TaskListHeaderComponent, CommonModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService logout when logout is called', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
