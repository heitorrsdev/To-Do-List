import { CreateTaskDto, Task, UpdateTaskDto } from '../models/task.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { importProvidersFrom } from '@angular/core';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        importProvidersFrom(HttpClientTestingModule)
      ]
    });

    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
    // ⬆️ Isso permite interceptar as requisições HTTP, para que o serviço possa ser testado sem fazer chamadas reais à API
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all tasks', () => {
    const dummyTasks: Task[] = [
      {
        _id: '1',
        title: 'Task 1',
        status: 'pending',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '2',
        title: 'Task 2',
        status: 'completed',
        userId: 'user1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(dummyTasks);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTasks);
  });

  it('should create a new task', () => {
    const newTask: CreateTaskDto = { title: 'New Task', status: 'pending' };
    const dummyTask: Task = {
      _id: '3',
      title: 'New Task',
      status: 'pending',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.createTask(newTask).subscribe((task) => {
      expect(task).toEqual(dummyTask);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(dummyTask);
  });

  it('should update an existing task', () => {
    const taskId = '1';
    const updatedData: UpdateTaskDto = { status: 'completed' };
    const dummyUpdatedTask: Task = {
      _id: '1',
      title: 'Task 1',
      status: 'completed',
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    service.updateTask(taskId, updatedData).subscribe((task) => {
      expect(task).toEqual(dummyUpdatedTask);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    req.flush(dummyUpdatedTask);
  });

  it('should delete a task', () => {
    const taskId = '1';
    const dummyResponse = { message: 'Task deleted successfully' };

    service.deleteTask(taskId).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

  it('should delete all completed tasks', () => {
    const dummyResponse = { message: 'Completed tasks deleted successfully' };

    service.deleteCompletedTasks().subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/completed`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });

  it('should delete all tasks', () => {
    const dummyResponse = { message: 'All tasks deleted successfully' };

    service.deleteAllTasks().subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/tasks/all`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyResponse);
  });
});
