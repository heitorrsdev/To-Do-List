import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the modal when "open" is true', () => {
    component.open = true;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('.dialog-modal'));
    expect(modal).toBeTruthy();
  });

  it('should not display the modal when "open" is false', () => {
    component.open = false;
    fixture.detectChanges();

    const modal = fixture.debugElement.query(By.css('.dialog-modal'));
    expect(modal).toBeFalsy();
  });

  it('should emit the "closed" event when close() is called', () => {
    spyOn(component.closed, 'emit');

    component.close();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit the "closed" event when clicking on the backdrop', () => {
    component.open = true;
    component.closeOnBackdropClick = true;
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.dialog-backdrop'));
    spyOn(component, 'close');

    backdrop.triggerEventHandler('click', {
      target: backdrop.nativeElement,
      currentTarget: backdrop.nativeElement
    });

    expect(component.close).toHaveBeenCalled();
  });

  it('should not emit the "closed" event when clicking inside the modal', () => {
    component.open = true;
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.dialog-backdrop'));
    spyOn(component, 'close');

    backdrop.triggerEventHandler('click', {
      target: {}, // qualquer objeto que não seja igual ao currentTarget
      currentTarget: backdrop.nativeElement
    });

    expect(component.close).not.toHaveBeenCalled();
  });

  it('should emit the "closed" event when clicking the close button', () => {
    component.open = true;
    fixture.detectChanges();

    spyOn(component, 'close');

    const closeBtn = fixture.debugElement.query(By.css('.dialog-close'));
    closeBtn.triggerEventHandler('click', null);

    expect(component.close).toHaveBeenCalled();
  });
});
