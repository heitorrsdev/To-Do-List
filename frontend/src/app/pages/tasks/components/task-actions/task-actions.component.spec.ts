import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskActionsComponent } from './task-actions.component';

describe('TaskActionsComponent', () => {
  let component: TaskActionsComponent;
  let fixture: ComponentFixture<TaskActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close the menu when the hamburguer button is clicked', () => {
    const hamburguerButton = fixture.debugElement.query(By.css('.hamburger-btn'));
    hamburguerButton.triggerEventHandler('click');
    fixture.detectChanges();

    expect(component.isMenuOpen).toBeTruthy();
    const dropdown = fixture.debugElement.query(By.css('.dropdown'));
    expect(dropdown).toBeTruthy();

    hamburguerButton.triggerEventHandler('click');
    fixture.detectChanges();
    expect(component.isMenuOpen).toBeFalsy();
  });

  it('should emit deleteCompletedTasks and close menu', () => {
    spyOn(component.deleteCompletedTasks, 'emit');

    component.isMenuOpen = true;
    component.hasCompletedTasks = true;
    fixture.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('.action-button'))[0];
    button.triggerEventHandler('click');
    fixture.detectChanges();

    expect(component.deleteCompletedTasks.emit).toHaveBeenCalled();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should emit deleteAllTasks and close menu', () => {
    spyOn(component.deleteAllTasks, 'emit');

    component.isMenuOpen = true;
    component.hasTasks = true;
    fixture.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('.action-button'))[1];
    button.triggerEventHandler('click');
    fixture.detectChanges();

    expect(component.deleteAllTasks.emit).toHaveBeenCalled();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should disable delete completed tasks button when there are no completed tasks', () => {
    component.isMenuOpen = true;
    component.isLoading = false;
    component.hasCompletedTasks = false;
    fixture.detectChanges();

    const button = fixture.debugElement.queryAll(By.css('.action-button'))[0];

    expect(button.nativeElement.disabled).toBeTrue();
  });

  it('should close dropdown when other element is clicked', () => {
    component.isMenuOpen = true;
    fixture.detectChanges();

    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', {
      value: document.createElement('div'),
      writable: false
    });

    document.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(component.isMenuOpen).toBeFalse();
  });

  it('should not close dropdown when it is clicked', () => {
    component.isMenuOpen = true;
    fixture.detectChanges();

    const dropdown = fixture.debugElement.query(By.css('.dropdown')).nativeElement;
    const clickEvent = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(clickEvent, 'target', {
      value: dropdown,
      writable: false
    });

    document.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(component.isMenuOpen).toBeTrue();
  });
});
