import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPerfilProfissionalPage } from './editar-perfil-profissional.page';

describe('EditarPerfilProfissionalPage', () => {
  let component: EditarPerfilProfissionalPage;
  let fixture: ComponentFixture<EditarPerfilProfissionalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPerfilProfissionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
