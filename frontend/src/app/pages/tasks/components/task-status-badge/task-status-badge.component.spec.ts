import { CommonModule } from '@angular/common'; // renderiza *ngIf e ngClass no template
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatusBadgeComponent } from './task-status-badge.component';

describe('TaskStatusBadgeComponent', () => {
  let component: TaskStatusBadgeComponent;
  let fixture: ComponentFixture<TaskStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStatusBadgeComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit statusChange when onStatusClick is called', () => {
    spyOn(component.statusChange, 'emit');

    component.onStatusClick();

    expect(component.statusChange.emit).toHaveBeenCalled();
  });
});
