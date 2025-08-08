import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTaskDto } from '../../../../core/services/task.service';
import { TASK_TITLE_MAX_LENGTH } from '../../../../core/constants';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not accept a empty title', () => {
    spyOn(component.taskSubmitted, 'emit');

    component.taskForm.patchValue({ title: '' });

    component.onSubmit();

    expect(component.taskForm.valid).toBeFalse();
    expect(component.taskSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should not accept a title longer than the max title limit', () => {
    spyOn(component.taskSubmitted, 'emit');

    const longText = 'a'.repeat(TASK_TITLE_MAX_LENGTH + 1);

    component.taskForm.patchValue({ title: longText });

    component.onSubmit();

    expect(component.taskForm.valid).toBeFalse();
    expect(component.taskForm.get('title')?.hasError('maxlength')).toBeTrue();
    expect(component.taskSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should create a task with pending stat', () => {
    spyOn(component.taskSubmitted, 'emit');

    const text: string = 'Você sabia que shinigamis gostam de maçã?';
    const dummyTask: CreateTaskDto = { title: text, status: 'pending' };
    component.taskForm.patchValue({ title: text });

    component.onSubmit();

    expect(component.taskSubmitted.emit).toHaveBeenCalledWith(dummyTask);
  });

  it('should emit taskSubmitted on submit', () => {
    spyOn(component.taskSubmitted, 'emit');

    component.taskForm.patchValue({ title: 'A resposta é... 42.' });
    component.onSubmit();

    expect(component.taskSubmitted.emit).toHaveBeenCalled();
  });
});
