import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTaskDto, Task } from '../../core/models/task.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from '../../core/services/notification.service';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../core/services/task.service';
import { of, throwError } from 'rxjs';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    { _id: '1', title: 'Tarefa 1', status: 'pending', userId: 'u1', createdAt: new Date(), updatedAt: new Date() },
    { _id: '2', title: 'Tarefa 2', status: 'completed', userId: 'u1', createdAt: new Date(), updatedAt: new Date() },
  ];

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'createTask',
      'getTasks',
      'updateTask',
      'deleteTask',
      'deleteCompletedTasks',
      'deleteAllTasks'
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showWarning']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, HttpClientTestingModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on ngOnInit', () => {
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();

    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading tasks', () => {
    taskServiceSpy.getTasks.and.returnValue(throwError(() => new Error('Error')));

    component.loadTasks();

    expect(component.isLoading).toBeFalse();
    expect(component.tasks.length).toBe(0);
  });

  it('should add new task on onTaskSubmitted', () => {
    const dto: CreateTaskDto = { title: 'New', status: 'pending' };
    const newTask: Task = { ...dto, _id: '3', userId: 'u1', createdAt: new Date(), updatedAt: new Date() };
    taskServiceSpy.createTask.and.returnValue(of(newTask));

    component.onTaskSubmitted(dto);

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(dto);
    expect(component.tasks).toContain(newTask);
  });

  it('should update task status', () => {
    component.tasks = [...mockTasks];
    const updatedTask: Task = { ...mockTasks[0], status: 'in-progress' };
    taskServiceSpy.updateTask.and.returnValue(of(updatedTask));

    component.onTaskStatusChange(mockTasks[0]);

    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
    expect(component.tasks[0].status).toBe('in-progress');
  });

  it('should open dialog when selecting a task', () => {
    component.onTaskSelected(mockTasks[0]);

    expect(component.selectedTask?._id).toBe('1');
    expect(component.isTaskDialogOpen).toBeTrue();
  });

  it('should save title edit', () => {
    component.selectedTask = { ...mockTasks[0] };
    component.tasks = mockTasks;
    const updatedTask = { ...mockTasks[0], title: 'Edited' };
    taskServiceSpy.updateTask.and.returnValue(of(updatedTask));

    component.onEditSaved('Edited');

    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
    expect(component.tasks[0].title).toBe('Edited');
    expect(component.isTaskDialogOpen).toBeFalse();
  });

  it('should not save invalid edit', () => {
    component.selectedTask = { ...mockTasks[0] };

    component.onEditSaved(''); // título vazio
    expect(taskServiceSpy.updateTask).not.toHaveBeenCalled();
  });

  it('should confirm task deletion', () => {
    component.tasks = [...mockTasks];
    component.taskIdToDelete = '1';
    taskServiceSpy.deleteTask.and.returnValue(of({ message: 'Exclusão concluída' }));

    component.onDeleteConfirmed();

    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith('1');
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
    expect(component.tasks.length).toBe(1);
  });

  it('should delete completed tasks', () => {
    component.tasks = [...mockTasks];
    taskServiceSpy.deleteCompletedTasks.and.returnValue(of({ message: 'Tarefas concluídas excluidas' }));

    component.onDeleteCompletedTasks();

    expect(component.tasks.some(t => t.status === 'completed')).toBeFalse();
  });

  it('should delete all tasks', () => {
    component.tasks = [...mockTasks];
    taskServiceSpy.deleteAllTasks.and.returnValue(of({ message: 'Todas as tarefas foram excluidas' }));

    component.onDeleteAllTasks();

    expect(component.tasks.length).toBe(0);
  });

  it('should warn when there are no tasks to delete', () => {
    component.tasks = [];

    component.onDeleteAllTasks();

    expect(notificationServiceSpy.showWarning).toHaveBeenCalled();
    expect(taskServiceSpy.deleteAllTasks).not.toHaveBeenCalled();
  });

  it('should check hasTasks correctly', () => {
    component.tasks = [...mockTasks];
    expect(component.hasTasks()).toBeTrue();
    component.tasks = [];
    expect(component.hasTasks()).toBeFalse();
  });

  it('should check hasCompletedTasks correctly', () => {
    component.tasks = [...mockTasks];
    expect(component.hasCompletedTasks()).toBeTrue();
    component.tasks = [mockTasks[0]];
    expect(component.hasCompletedTasks()).toBeFalse();
  });

  it('trackByTaskId should return id', () => {
    expect(component.trackByTaskId(0, mockTasks[0])).toBe('1');
  });
});
