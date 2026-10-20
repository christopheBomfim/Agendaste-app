import { TestBed } from '@angular/core/testing';
import { Agendamentos } from './agendamentos.service';

describe('Agendamentos', () => {
  let service: Agendamentos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Agendamentos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
