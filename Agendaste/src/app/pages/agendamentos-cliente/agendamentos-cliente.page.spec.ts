import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgendamentosClientePage } from './agendamentos-cliente.page';

describe('AgendamentosClientePage', () => {
  let component: AgendamentosClientePage;
  let fixture: ComponentFixture<AgendamentosClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendamentosClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
