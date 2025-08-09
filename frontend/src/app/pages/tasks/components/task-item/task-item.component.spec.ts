import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../../../core/models/task.model';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  const mockTask: Task = {
    _id: '1',
    title: 'linuxMelhorQueWindows Da Silva',
    status: 'in-progress',
    userId: '42',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = { ...mockTask };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit statusChange event when cycleStatus() is called', () => {
    spyOn(component.statusChange, 'emit');
    component.cycleStatus();
    expect(component.statusChange.emit).toHaveBeenCalledWith(component.task);
  });

  it('should emit taskSelected event when openTaskDetails() is called', () => {
    spyOn(component.taskSelected, 'emit');
    component.openTaskDetails();
    expect(component.taskSelected.emit).toHaveBeenCalledWith(component.task);
  });

  it('should emit statusChange event when status button is clicked', () => {
    spyOn(component.statusChange, 'emit');
    const button = fixture.debugElement.query(By.css('button.status-circle'));
    button.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(component.statusChange.emit).toHaveBeenCalledWith(component.task);
  });

  it('should emit taskSelected event when task title label is clicked', () => {
    spyOn(component.taskSelected, 'emit');
    const label = fixture.debugElement.query(By.css('label.task-title'));
    label.triggerEventHandler('click', null);
    expect(component.taskSelected.emit).toHaveBeenCalledWith(component.task);
  });

  it('should apply "in-progress" CSS class when task status is "in-progress"', () => {
    const liElement: HTMLElement = fixture.nativeElement.querySelector('li.task-item');
    expect(liElement.classList).toContain('in-progress');
    expect(liElement.classList).not.toContain('completed');
  });

  it('should apply "completed" CSS class when task status is "completed"', () => {
    component.task.status = 'completed';
    fixture.detectChanges();
    const liElement: HTMLLIElement = fixture.nativeElement.querySelector('li.task-item');
    expect(liElement.classList).toContain('completed');
    expect(liElement.classList).not.toContain('in-progress');
  });
});
