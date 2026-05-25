import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HomeComponent } from './home';
import { AuthGuardService } from '../../../middleware/middleware.authguard';
import { ExpenseService } from '../../../services/expense.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthGuardService,
          useValue: {
            authState$: of(false),
            hasAnyRole: () => false,
          },
        },
        {
          provide: ExpenseService,
          useValue: {
            getExpenses: () => of([]),
            getReferenceData: () =>
              of({
                kategorije: [],
                odjeli: [],
                valute: [],
                projekti: [],
                dobavljaci: [],
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
