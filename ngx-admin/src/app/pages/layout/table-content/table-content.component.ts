import { Component, OnInit, ViewChild, TemplateRef, Injectable, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../api.service';
import { Globals } from '../../../@core/data/globals';
import * as XLSX from 'xlsx';
// import { FileSaverService } from 'ngx-filesaver';
import { forkJoin } from 'rxjs';
import { ConfirmationService, FilterMatchMode, SelectItem } from 'primeng/api';
import {
  NgbDateStruct,
  ModalDismissReasons,
  NgbModal,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbCalendarPersian,
  NgbDate,

} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'jalali-moment';
import { Table } from 'primeng/table';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

// import { MatIconModule } from '@angular/material/icon';

interface Alert {
  type: string;
  message: string;
}
const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

const ALERTS: Alert[] = [
  {
    type: 'Access denied',
    message: "You don't have permission to do this action!",
  }];

@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayLabel(weekday: number) {
    return WEEKDAYS_SHORT[weekday - 1];
  }
  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }
  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }
  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`;
  }
}


@Component({
  selector: 'ngx-table-content',
  templateUrl: './table-content.component.html',
  styleUrls: ['./table-content.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },

  ],
})
export class TableContentComponent implements OnInit {
  dateFilters: string[];
  dateMatchModeOptions: SelectItem[];
  minDate = { year: 1320, month: 1, day: 1 };
  maxDate = { year: 1450, month: 1, day: 1 };


  showRange: Array<boolean> = [];
  @ViewChild("datePickerTemplate")
  datePickerTemplate: TemplateRef<any>;
  closeResult = '';
  @ViewChild("dt2") table: Table;
  @ViewChild("contentTemplate", { static: true })
  contentTemplate: TemplateRef<any>;
  @ViewChild('file', { static: false })
  InputVar: ElementRef;
  readonly DELIMITER = '-';
  tableName: string;
  tableData: any[] = [];
  tbData: any[] = [];
  tableContent: any[];
  tableDataType: any[] = [];
  tbDataType: any[] = [];
  pipes;
  formGenerator: FormGroup;
  id = null;
  edittingData = null;
  dateFieldName = null;
  excelData: any[] = [];
  columns: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private modalService: NgbModal,
    public globals: Globals,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    // private fileSaver: FileSaverService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }
  model: NgbDateStruct;
  date: { year: number; month: number };
  startDateModel: NgbDateStruct;
  endDateModel: NgbDateStruct;
  fromMinDate: NgbDateStruct;
  toMinDate: NgbDateStruct = {
    year: Number(moment().locale('fa').format('YYYY')),
    month: Number(moment().locale('fa').format('MM')),
    day: Number(moment().locale('fa').format('DD'))
  };
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  alerts: Alert[];
  error = null;

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  onDateSelection(date: NgbDate) {
    console.log(date)
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  dateFilter(event: NgbDate, datefield_name: string) {
    console.log('date: ', datefield_name)
    let temp = event.year + "-" + event.month + "-" + event.day
    this.table.filter(
      temp,
      datefield_name,
      FilterMatchMode.EQUALS
    );
  }
  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  selectToday() {
    this.model = this.calendar.getToday();
  }

  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (!token) {
      this.router.navigate(['pages/login']);
    } else {
      this.route.params.subscribe(params => {
        this.tableName = params['tableName'];
        this.hiddenColumns();
        this.loadTableData();
      });
      this.pipes = this.globals.pipeDropdown;
    }
  };
  hiddenColumns() {
    this.apiService.hiddenColumns().subscribe((data: any) => {
      data.forEach(element => {
        this.columns.push(element.colname);
      });
      // (error) => {
      //   this.error = error.message;
      //   console.log(this.error)
      // }
      console.log("columns", this.columns);
    });

  };
  loadTableData() {

    this.apiService.getTableContent(this.tableName).subscribe((data: any) => {
      console.log("full data: ", data);
      this.tbData = data.field_names;
      this.tbData.forEach(element => {
        if (!this.columns.includes(element)) {
          this.tableData.push(element);
        };
      });
      console.log("tableData", this.tableData);
      this.tableContent = data.table_content;
      data.field_type.forEach(element => {
        if (element.type === 'DateField') {
          this.dateFieldName = element.name;
        };
      });
      data.table_content.forEach(element => {
        if (element[this.dateFieldName]) {
          element[this.dateFieldName] = moment(element[this.dateFieldName], 'YYYY-M-D').format('jYYYY-jM-jD');
        }
      });
      this.tbDataType = data.field_type;
      this.tbDataType.forEach(element => {
        if (!this.columns.includes(element.name)) {
          this.tableDataType.push(element);
        };
      });
      console.log('tabledatatype', this.tableDataType)
      let group = {};
      this.tableData.forEach(element => {
        group[element] = new FormControl('');
      });
      this.formGenerator = new FormGroup(group);

    }
      // (error) => {
      //   this.error = error.message;
      //   console.log(this.error)
      // }
    );

  }

  clear(table) {
    table.clear();
  }
  open(content) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'saved') {
          this.saveFormGenerator();
          this.formGenerator.reset();
        } else {
          this.formGenerator.reset();
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.formGenerator.reset();
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  openFileImport(fileImport) {
    this.modalService.open(fileImport, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    )
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  editData(item, content) {
    this.edittingData = item;
    if (this.dateFieldName) {
      var dateField = this.edittingData[this.dateFieldName]
      // console.log('date field', date)
      console.log('edited: ', item);
      var dateSplit = dateField.split("-");
      var year = Number(dateSplit[0]);
      var month = Number(dateSplit[1]);
      var day = Number(dateSplit[2]);
      var date: NgbDateStruct = new NgbDate(year, month, day);
    }
    let formValues = {};
    this.tableData.forEach(element => {
      if (element === this.dateFieldName) {
        formValues[this.dateFieldName] = date;
      } else {
        formValues[element] = this.edittingData[element];
      }
    });
    this.id = this.edittingData.id;

    setTimeout(() => {
      this.formGenerator.setValue(formValues);
    });

    this.open(content);

  }
  saveFormGenerator() {
    if (this.dateFieldName) {
      var d = this.formGenerator.value[this.dateFieldName]

      let miladi_d = moment(d.year + "/" + d.month + "/" + d.day, "jYYYY/jM/jD").format('YYYY-MM-DD')
      this.formGenerator.value[this.dateFieldName] = miladi_d
    }
    if (this.id) {
      this.apiService.updateData(this.formGenerator.value, this.id, this.tableName).subscribe(
        result => {
          this.dataUpdated(result)
          console.log(result)
        }
      )
      this.id = undefined;
    } else {
      this.apiService.createData(this.formGenerator.value, this.tableName).subscribe(
        result => {
          this.dataCreated(result)
          console.log(result)
        },
        error => console.log(error)
      );
    }
  }

  dataCreated(item) {
    if (item) {
      this.tableContent.push(item);
      if (this.dateFieldName) {
        item[this.dateFieldName] = moment(item[this.dateFieldName], 'YYYY-M-D').format('jYYYY-jM-jD');
      }
    } else {
      console.error('item is null or undefined');
    }
  }

  dataUpdated(item) {
    const indx = this.tableContent.findIndex(dta => dta.id === item.id);
    if (indx >= 0) {
      this.tableContent[indx] = item;
      this.tableContent[indx][this.dateFieldName] = moment(this.tableContent[indx][this.dateFieldName], 'YYYY-M-D').format('jYYYY-jM-jD')
    };
    this.edittingData = null;
    console.log('edittingdata', this.edittingData)
  };
  deleteRecord(item, tableName) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete User',
      accept: () => {
        this.apiService.deleteData(item.id, tableName).subscribe(
          data => this.tableContent = this.tableContent.filter(boo => boo.id !== item.id),
          error => console.log(error));
      },

    });
  };

  exportToExcel() {

    this.apiService.getTableContent(this.tableName).subscribe((data: any) => {
      let tableData = data.table_content;
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      XLSX.writeFile(workbook, 'exported-data.xlsx')
    });

  }

  saveExcel() {
    if (this.InputVar) {
      this.InputVar.nativeElement.value = '';
    }
  }


  readExcel(event) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);

      console.log(this.excelData);
      console.log("Excel Data Length:", this.excelData.length);
      this.excelData.forEach(record =>
        this.apiService.createData(record, this.tableName).subscribe(data => {
          this.dataCreated(data)
        })
      )
    }
  }

}






