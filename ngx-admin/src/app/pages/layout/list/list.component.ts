import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Injectable, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api.service';
import * as XLSX from 'xlsx';
import * as bootstrap from 'bootstrap';
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
import { Globals } from '../../../@core/data/globals';
import { Router } from '@angular/router';


const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

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
  selector: 'ngx-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss'],
  styles: [
    `
    .dp-hidden {
      width: 0;
      margin: 0;
      border: none;
      padding: 0;
    }
			.custom-day {
				text-align: center;
				padding: 0.185rem 0.25rem;
				display: inline-block;
				height: 2rem;
				width: 2rem;
			}
			.custom-day.focused {
				background-color: #e6e6e6;
			}
			.custom-day.range,
			.custom-day:hover {
				background-color: rgb(2, 117, 216);
				color: white;
			}
			.custom-day.faded {
				background-color: rgba(2, 117, 216, 0.5);
			}
		`,
  ],

  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },

  ],

})
export class ListComponent implements OnInit, AfterViewInit {
  @ViewChild('helloModal') helloEl?: bootstrap.Modal;
  @ViewChild('importModal') importEl?: ElementRef;
  @ViewChild('file', { static: false })
  InputVar: ElementRef;
  modal1?: bootstrap.Modal;
  modal2?: bootstrap.Modal;
  dateFilters: string[];
  dateMatchModeOptions: SelectItem[];
  minDate = { year: 1320, month: 1, day: 1 };
  maxDate = { year: 1450, month: 1, day: 1 };


  showRange: Array<boolean> = [];
  @ViewChild("datePickerTemplate")
  datePickerTemplate: TemplateRef<any>;

  @ViewChild("dt1") table: Table;

  @ViewChild("contentTemplate", { static: true })
  contentTemplate: TemplateRef<any>;
  readonly DELIMITER = '-';
  ngAfterViewInit() {
    this.modal1 = new bootstrap.Modal(this.helloEl?.nativeElement, {});
    this.modal2 = new bootstrap.Modal(this.importEl?.nativeElement, {});
  }
  constructor(
    calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private apiService: ApiService,
    private confirmationService: ConfirmationService,
    private modalService: NgbModal,
    public globals: Globals,
    private router: Router
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    console.log(this.globals.pipeCols)
  }
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
    let temp = event.year + "-" + event.month + "-" + event.day
    this.table.filter(
      temp,
      'birthdate',
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
  triggerFirst() {
    this.modal1.toggle();
  }
  triggerSecond() {
    this.modal2.toggle();
  }
  levels;
  status;
  pipes;
  closeResult = '';
  calendar;
  books;
  calendarVal;
  id = null;
  selectedBook = null;
  selectedPerson = null;
  edittingPerson = null;
  editingBook = null;
  bookForm;
  personForm: FormGroup;
  excelData;
  tableData?;
  cols;
  dateValue = new FormControl();
  model: NgbDateStruct;
  date: { year: number; month: number };
  education: string;
  personCol = [];
  personBody = [];
  personTable;
  personTableData;
  dataCol = [];
  personTableDataType = [];
  dataTypeCol = [];
  testpipe = [];
  tablesName;
  // tableName;
  selectedTableName: string;

  ngOnInit(): void {

    let val = {
      id: null,
      published: null,
      title: null,
      writer: null,
      age: null,
      ismarried: null,
      education: null,
    }
    this.id = val.id;
    // this.calendarVal = new Date(val.published);
    this.bookForm = new FormGroup({
      title: new FormControl(val.title),
      writer: new FormControl(val.writer),
      published: new FormControl(this.calendarVal),
      age: new FormControl(val.age),
      ismarried: new FormControl(val.ismarried),
      education: new FormControl(val.education),
    });
    this.apiService.getTablesName().subscribe((data: any) => {

      this.tablesName = data
      console.log(this.tablesName)
    })

    // this.apiService.getBooks().subscribe((data: any) => {
    //   this.tableData = data


    //   this.tableData.forEach(element => {
    //     element.published = moment(element.published, 'YYYY-M-D').format('jYYYY-jM-jD')
    //   });

    // }
    // )
    // this.apiService.getEducation().subscribe(
    //   data => this.levels = data
    // )
    // this.apiService.getMarried().subscribe(
    //   data => this.status = data
    // )

    this.pipes = this.globals.pipeDropdown
    this.apiService.getPerson().subscribe((result: any) => {
      this.personTable = result
      console.log(this.personTable)

      this.personTableData = this.personTable.data
      this.personTableDataType = this.personTable.dataTypes
      console.log("persontabledata", this.personTableData)

      this.personTableData.forEach(element => {
        element.birthdate = moment(element.birthdate, 'YYYY-M-D').format('jYYYY-jM-jD')
        this.dataCol.push(element)
      });
      this.personTableDataType.forEach(element => {
        this.dataTypeCol.push(element.type)
      })
      let headers = []
      for (let key in this.dataCol[0]) {
        headers.push(key)
      }
      this.personCol = headers
      console.log('personTableDataType ', this.personTableDataType)


      let group = {}
      this.personCol.forEach(input_template => {
        group[input_template] = new FormControl('');
      })
      this.personForm = new FormGroup(group);


    })

    this.cols = [
      {
        field: 'title',
        header: 'Title'
      },
      {
        field: 'writer',
        header: 'Writer'
      },
      {
        field: 'age',
        header: 'Age'
      },
      {
        field: 'ismarried',
        header: 'Status'
      },
      {
        field: 'education',
        header: 'Education'
      },

      {
        field: 'published',
        header: 'Published'
      },
    ];
  }

  navigateToTableContent() {
    if (this.selectedTableName) {
      this.router.navigate(['pages/layout/table-content', this.selectedTableName]);
    }
  }



  // selectToday() {
  //   this.model = this.calendar.getToday();
  // }
  clear(table) {
    table.clear();
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
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'saved') {
          this.savePerson();
        }
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  selectBook(item) {
    this.selectedBook = item;
    this.editingBook = null;
    // console.log(this.selectedBook)
  }
  // selectPerson(item){
  //   this.selectedPerson = item;
  //   this.edittingPerson = null;
  // }
  editBook(item) {
    this.editingBook = item;
    this.selectedBook = null;
    console.log(this.editingBook)
    // var date = new Date(item.published)
    this.id = item.id;
    var dateSplit = this.editingBook.published.split("-")
    var year = Number(dateSplit[0])
    var month = Number(dateSplit[1])
    var day = Number(dateSplit[2])
    var date: NgbDateStruct = new NgbDate(year, month, day);
    this.bookForm = new FormGroup({
      title: new FormControl(this.editingBook.title),
      writer: new FormControl(this.editingBook.writer),
      age: new FormControl(this.editingBook.age),
      ismarried: new FormControl(this.editingBook.ismarried),
      education: new FormControl(this.editingBook.education),
      published: new FormControl(date)
    });
    // console.log(this.editingBook)
    this.modal1?.toggle();
  }
  editUser(item, content) {
    this.edittingPerson = item;
    this.selectedPerson = null;
    console.log(this.edittingPerson)
    var dateSplit = this.edittingPerson.birthdate.split("-")
    var year = Number(dateSplit[0])
    var month = Number(dateSplit[1])
    var day = Number(dateSplit[2])
    var date: NgbDateStruct = new NgbDate(year, month, day);
    let group = {}
    this.personCol.forEach(input_template => {
      if (input_template === 'birthdate') {
        group['birthdate'] = new FormControl(date);
      } else {
        group[input_template] = new FormControl(this.edittingPerson[input_template]);
      }
    })
    this.id = this.edittingPerson.userid;
    this.personForm = new FormGroup(group);
    this.open(content);
  }
  createNewBooks() {
    this.editingBook = { title: '', writer: '', age: '', ismarried: '', education: '', published: '' }
    this.bookForm = new FormGroup({
      title: new FormControl(this.editingBook.title),
      writer: new FormControl(this.editingBook.writer),
      age: new FormControl(this.editingBook.age),
      ismarried: new FormControl(this.editingBook.ismarried),
      education: new FormControl(this.editingBook.education),
      published: new FormControl(this.editingBook.published)
    });
    // console.log(this.bookForm)
    this.selectedBook = null
    // console.log(this.selectedBook)
    this.id = undefined

  }

  // deleteBooks(item) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this item?',
  //     header: 'Delete item',
  //     accept: () => {
  //       this.apiService.deleteBook(item.id).subscribe(
  //         data => this.tableData = this.tableData.filter(boo => boo.id !== item.id),
  //         error => console.log(error))
  //     }

  //   })
  // }
  deleteUser(item) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete User',
      accept: () => {
        this.apiService.deleteUser(item.userid).subscribe(
          data => this.personTableData = this.personTableData.filter(boo => boo.userid !== item.userid),
          error => console.log(error))
      }

    })
  }
  // saveForm() {
  //   var d = this.bookForm.value.published
  //   let miladi_d = moment(
  //     d.year + "/" + d.month + "/" + d.day,
  //     "jYYYY/jM/jD"
  //   ).format('YYYY-M-D')

  //   if (this.id) {
  //     // console.log(temp)
  //     this.apiService.updateBook(this.id, this.bookForm.value.title, this.bookForm.value.writer, this.bookForm.value.age, Number(this.bookForm.value.ismarried), this.bookForm.value.education, miladi_d).subscribe(
  //       result => this.bookUpdated(result),
  //       error => console.log(error)
  //     );
  //   } else {
  //     this.apiService.createBook(this.bookForm.value.title, this.bookForm.value.writer, this.bookForm.value.age, Number(this.bookForm.value.ismarried), this.bookForm.value.education, miladi_d).subscribe(
  //       result => {
  //         this.bookCreated(result)
  //         console.log(result)
  //       },

  //       error => console.log(error)
  //     );
  //   }
  //   this.modal1?.toggle();
  // }

  savePerson() {
    var d = this.personForm.value.birthdate
    let miladi_d = moment(d.year + "/" + d.month + "/" + d.day,
      "jYYYY/jM/jD").format('YYYY-M-D')
    this.personForm.value.birthdate = miladi_d
    if (this.id) {
      this.apiService.updatePerson(this.personForm.value).subscribe(
        result => {
          this.personUpdated(result)
          console.log(result)
        }
      )
      this.id = undefined;
    } else {
      this.apiService.createPerson(this.personForm.value).subscribe(
        result => {
          this.personCreated(result)
          console.log(result)
        },

        error => console.log(error)
      );
    }


  }
  bookCreated(books) {

    books.forEach(element => {

      this.tableData.push(element);
      element.published = moment(element.published, 'YYYY-M-D').format('jYYYY-jM-jD')
    });

  }
  personCreated(person) {

    this.personTableData.push(person);
    person.birthdate = moment(person.birthdate, 'YYYY-M-D').format('jYYYY-jM-jD')
  }

  bookUpdated(item) {
    const indx = this.tableData.findIndex(boo => boo.id === item.id)

    if (indx >= 0) {
      this.tableData[indx] = item


      this.tableData[indx].published = moment(this.tableData[indx].published, 'YYYY-M-D').format('jYYYY-jM-jD')
    }
    this.editingBook = null
  }
  personUpdated(item) {
    const indx = this.personTableData.findIndex(prsn => prsn.userid === item.userid)

    if (indx >= 0) {
      this.personTableData[indx] = item
      this.personTableData[indx].birthdate = moment(this.personTableData[indx].birthdate, 'YYYY-M-D').format('jYYYY-jM-jD')
    }
    this.edittingPerson = null
  }

  reset() {
    this.InputVar.nativeElement.value = "";
  }

  saveExcel() {
    this.modal2?.toggle();
    this.InputVar.nativeElement.value = "";
  }
  readExcel(event) {
    let file = event.target.files[0];

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
      this.excelData.forEach(element => {
        var dateMiladi = element.published
        var dateSplit = dateMiladi.split("-")
        var year = dateSplit[0]
        var month = dateSplit[1]
        var day = dateSplit[2]
        let miladi_d = moment(
          year + "/" + month + "/" + day,
          "jYYYY/jM/jD"
        ).format('YYYY-M-D')
        element.published = miladi_d

      })
      console.log(this.excelData);
      // this.apiService.createExcel(this.excelData).subscribe(
      //   data => {
      //     this.excelData = data;
      //     this.bookCreated(data);
      //   },
      //   error => console.log(error)
      // );
    };
  }
}
