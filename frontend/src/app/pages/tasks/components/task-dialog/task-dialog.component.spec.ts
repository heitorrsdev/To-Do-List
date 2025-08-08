import { CommonModule } from '@angular/common'; // renderiza *ngIf e ngClass no template
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from '../dialog/dialog.component'; // renderiza o app-dialog
import { FormsModule } from '@angular/forms'; // renderiza ngModel
import { TaskDialogComponent } from './task-dialog.component';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDialogComponent, DialogComponent, CommonModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit "closed" when closeDialog is called', () => {
    spyOn(component.closed, 'emit');
    component.closeDialog();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit "editEnabled" when enableEditTask is called', () => {
    spyOn(component.editEnabled, 'emit');
    component.enableEditTask();
    expect(component.editEnabled.emit).toHaveBeenCalled();
  });

  it('should emit "editCancelled" when cancelEditTask is called', () => {
    spyOn(component.editCancelled, 'emit');
    component.cancelEditTask();
    expect(component.editCancelled.emit).toHaveBeenCalled();
  });

  it('should emit "editSaved" when saveEditTask is called', () => {
    spyOn(component.editSaved, 'emit');
    component.saveEditTask();
    expect(component.editSaved.emit).toHaveBeenCalledWith('');
  });

  it('should not emit "deleteRequested" when showDeleteTaskConfirmation param is undefined', () => {
    spyOn(component.deleteRequested, 'emit');
    component.showDeleteTaskConfirmation(undefined);
    expect(component.deleteRequested.emit).not.toHaveBeenCalled();
  });

  it('should emit "deleteRequested" when showDeleteTaskConfirmation is called', () => {
    spyOn(component.deleteRequested, 'emit');
    component.showDeleteTaskConfirmation('123');
    expect(component.deleteRequested.emit).toHaveBeenCalledWith('123');
  });

  it('should emit "deleteConfirmed" when confirmDeleteTask is called', () => {
    spyOn(component.deleteConfirmed, 'emit');
    component.confirmDeleteTask();
    expect(component.deleteConfirmed.emit).toHaveBeenCalled();
  });

  it('should emit "deleteCancelled" when cancelDeleteTask is called', () => {
    spyOn(component.deleteCancelled, 'emit');
    component.cancelDeleteTask();
    expect(component.deleteCancelled.emit).toHaveBeenCalled();
  });

  it('should resize the textarea when resizeTextarea is called', () => {
    const textarea = document.createElement('textarea');
    textarea.value = '\nQue a Força\nesteja\ncom você.';
    document.body.appendChild(textarea);

    Object.defineProperty(textarea, 'scrollHeight', {value: 200, configurable: true});
    component.resizeTextarea(textarea, 150);

    expect(textarea.style.height).toBe('150px');
    expect(textarea.style.overflowY).toBe('auto');

    document.body.removeChild(textarea);
  });
});
