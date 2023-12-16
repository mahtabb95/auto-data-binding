import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
// import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { LoginComponent } from './authenticate/login/login.component';
import { NbCardModule } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    // ECommerceModule,
    MiscellaneousModule,
    NbCardModule,
  ],
  declarations: [
    PagesComponent,
    LoginComponent,
  ],
  providers: [
    CookieService,
  ]
})
export class PagesModule {
}
