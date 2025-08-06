import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct texts', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Suporte');
    expect(text).toContain('Projeto To-Do List');
    expect(text).toContain('GitHub');
    expect(text).toContain('© 2025');
  });

  it('should have the GitHub link with _blank', () => {
    const githubLink = fixture.debugElement.query(By.css('a[href*="github"]')).nativeElement; // link q contém github
    expect(githubLink.target).toBe('_blank');
  });

  it('should contain support e-mail', () => {
    const emailLink = fixture.debugElement.query(By.css('a[href^="mailto:"]')).nativeElement; // link q começa com mailto
    expect(emailLink.textContent).toContain('heitorrs.dev@gmail.com');
  });
});
