import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbListModule,
  NbDialogModule,
  NbRouteTabsetModule,
  NbStepperModule,
  NbDatepickerModule,
  NbTabsetModule, NbUserModule,
  NbInputModule,
  NbDatepicker,
} from '@nebular/theme';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../@theme/theme.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { Tab1Component, Tab2Component, TabsComponent } from './tabs/tabs.component';
// import { StepperComponent } from './stepper/stepper.component';
import { ListComponent } from './list/list.component';
import { TableContentComponent } from './table-content/table-content.component';
import { InfiniteListComponent } from './infinite-list/infinite-list.component';
import { NewsPostComponent } from './infinite-list/news-post/news-post.component';
import { NewsPostPlaceholderComponent } from './infinite-list/news-post-placeholder/news-post-placeholder.component';
import { AccordionComponent } from './accordion/accordion.component';
import { NewsService } from './news.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from "primeng/fileupload";
import { CalendarModule } from 'primeng/calendar';
import { EducationPipe } from '../../education.pipe';
import { StatusPipe } from '../../status.pipe';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { InputSwitchModule } from "primeng/inputswitch";
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ContextMenuModule } from 'primeng/contextmenu';
import { UsermarriedPipe } from '../../usermarried.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    FormsModule,
    NgbModule,
    NgbDatepickerModule,
    NgbAlertModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    DropdownModule,
    NbDialogModule,
    LayoutRoutingModule,
    NbDatepickerModule,
    NbInputModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    InputTextModule,
    FileUploadModule,
    CalendarModule,
    InputSwitchModule,
    MultiSelectModule,
    SliderModule,
    ContextMenuModule,
  ],
  declarations: [
    LayoutComponent,
    TabsComponent,
    Tab1Component,
    Tab2Component,
    // StepperComponent,
    ListComponent,
    TableContentComponent,
    NewsPostPlaceholderComponent,
    InfiniteListComponent,
    NewsPostComponent,
    AccordionComponent,
    EducationPipe,
    StatusPipe,
    UsermarriedPipe,
  ],
  providers: [
    NewsService,
    ConfirmationService,
  ],
})
export class LayoutModule { }
