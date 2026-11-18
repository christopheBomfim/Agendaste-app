import { TestBed } from '@angular/core/testing';
import { Profissionais } from './profissionais.service';

describe('Profissionais', () => {
  let service: Profissionais;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Profissionais);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
