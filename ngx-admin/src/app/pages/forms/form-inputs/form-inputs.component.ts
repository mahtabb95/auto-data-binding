import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api.service';


@Component({
    selector: 'ngx-form-inputs',
    styleUrls: ['./form-inputs.component.scss'],
    templateUrl: './form-inputs.component.html',
})
export class FormInputsComponent implements OnInit {

    calendarVal?: Date;
    bookForm;
    id = null;
    @Output() bookCreated = new EventEmitter()
    @Output() bookUpdated = new EventEmitter()
    @Input() set book(val: any) {
        this.id = val.id;
        this.calendarVal = new Date(val.published);
        this.bookForm = new FormGroup({
            title: new FormControl(val.title),
            writer: new FormControl(val.writer),
            published: new FormControl(this.calendarVal)
        });
    }
    starRate = 2;
    heartRate = 4;
    radioGroupValue = 'This is value 2';
    statuses: NbComponentStatus[] = ['Create'];

    constructor(private apiService: ApiService) { }
    ngOnInit(): void {

    }
    // saveForm() {


    //     if (this.id) {
    //         // console.log(temp)
    //         this.apiService.updateBook(this.id, this.bookForm.value.title, this.bookForm.value.writer, this.bookForm.value.age, this.bookForm.value.isMarried, this.bookForm.value.education, this.bookForm.value.published).subscribe(
    //             result => console.log(result),
    //             error => console.log(error)
    //         );
    //     } else {
    //         this.apiService.createBook(this.bookForm.value.title, this.bookForm.value.writer, this.bookForm.value.age, this.bookForm.value.isMarried, this.bookForm.value.education, this.bookForm.value.published).subscribe(
    //             result => {
    //                 console.log(result)
    //             },

    //             error => console.log(error)
    //         );
    //     }
    // }
}
