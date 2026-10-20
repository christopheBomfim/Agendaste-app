import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsProfissionalPage } from './tabs-profissional.page';

describe('TabsProfissionalPage', () => {
  let component: TabsProfissionalPage;
  let fixture: ComponentFixture<TabsProfissionalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsProfissionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
