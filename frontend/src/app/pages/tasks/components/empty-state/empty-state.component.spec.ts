import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default message when it has no input', () => {
    fixture.detectChanges();

    const liElement = fixture.debugElement.query(By.css('li')).nativeElement;
    expect(liElement.textContent.trim()).toBe('Nenhuma tarefa encontrada. Adicione uma nova tarefa acima.');
  });

  it('should display the input message', () => {
    const message: string = 'Mensagem muito explicativa';
    component.message = message;
    fixture.detectChanges();

    const liElement = fixture.debugElement.query(By.css('li')).nativeElement;
    expect(liElement.textContent.trim()).toBe(message);
  });
});
