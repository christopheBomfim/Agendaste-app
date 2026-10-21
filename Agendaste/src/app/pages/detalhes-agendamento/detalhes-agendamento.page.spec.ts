import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesAgendamentoPage } from './detalhes-agendamento.page';

describe('DetalhesAgendamentoPage', () => {
  let component: DetalhesAgendamentoPage;
  let fixture: ComponentFixture<DetalhesAgendamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesAgendamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
