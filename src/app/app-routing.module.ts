import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'orcamento',
    loadChildren: () => import('./orcamento/orcamento.module').then(m => m.OrcamentoModule)
  },
  {
    path: '', redirectTo: '/orcamento', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
