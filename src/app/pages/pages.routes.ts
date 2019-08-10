import { Routes, RouterModule } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProgressComponent } from "./progress/progress.component";
import { Graficas1Component } from "./graficas1/graficas1.component";
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { LoginGuardGuard } from "../services/service.index";
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const pagesRoutes: Routes = [
    {
        path: '', 
        component: PagesComponent,
        canActivate: [LoginGuardGuard],
        children: [
            {path: 'dashboard', component: DashboardComponent, data: {title: 'Dashboard'} },
            {path: 'progress', component: ProgressComponent, data: {title: 'Progress'}},
            {path: 'graficas', component: Graficas1Component, data: {title: 'Gráficos'}},
            {path: 'promesas', component: PromesasComponent, data: {title: 'Promesas'}},
            {path: 'rxjs', component: RxjsComponent, data: {title: 'RxJs'}},
            {path: 'account-settings', component: AccountSettingsComponent, data: {title: 'Ajustes de tema'}},
            {path: 'perfil', component: ProfileComponent, data: {title: 'Perfil de usuario'}},
            {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
            // Mantenimientos
            {path: 'usuarios', component: UsuariosComponent, data: {title: 'Usuarios'}},
            // {path: 'hospitales', component: HospitalesComponent, data: {title: 'hospitales'}},
            // {path: 'medicos', component: MedicosComponent, data: {title: 'medicos'}}
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );