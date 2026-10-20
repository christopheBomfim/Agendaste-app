import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardProfissionalPage } from './dashboard-profissional.page';

describe('DashboardProfissionalPage', () => {
  let component: DashboardProfissionalPage;
  let fixture: ComponentFixture<DashboardProfissionalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProfissionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
