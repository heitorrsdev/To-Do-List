import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, inject } from '@angular/core';
import { CreateTaskDto } from '../../../../core/services/task.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TASK_TITLE_MAX_LENGTH } from '../../../../core/constants';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() isLoading = false;
  @Output() taskSubmitted = new EventEmitter<CreateTaskDto>();

  @ViewChild('titleInput') titleInput!: ElementRef<HTMLTextAreaElement>;

  TASK_TITLE_MAX_LENGTH: number = TASK_TITLE_MAX_LENGTH;
  taskForm!: FormGroup;

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid || this.taskForm.value.title.trim().length > this.TASK_TITLE_MAX_LENGTH) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const newTaskData: CreateTaskDto = {
      title: this.taskForm.value.title.trim(),
      status: 'pending'
    };

    this.taskSubmitted.emit(newTaskData);
    this.taskForm.reset();
  }
}
