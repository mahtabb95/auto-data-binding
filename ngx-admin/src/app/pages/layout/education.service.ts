import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../@core/data/globals';
import { subscribe } from 'diagnostics_channel';
import { elementAt } from 'rxjs';
import { number } from 'echarts';


@Injectable()
export class EducationService {

    constructor(private httpClient: HttpClient, private globals: Globals) { }

    init() {
        // let baseUrlLevel = 'http://127.0.0.1:8000/level/';
        // let baseUrlMarried = 'http://127.0.0.1:8000/Married/';
        let baseUrl = 'http://127.0.0.1:8000/pipe/';


        this.httpClient.get(baseUrl).subscribe((data: any[]) => {
            let temp = new Map<string, any>();
            let template = new Map<string, any>();
            let pipeCol = [];
            data.forEach(element => {
                temp[element.field_name] = {}
            })

            data.forEach(element => {
                temp[element.field_name][element.field_id] = element.field_translate
                if (!pipeCol.includes(element.field_name)) {
                    pipeCol.push(element.field_name)
                }

            })
            console.log('pipecol', pipeCol)
            console.log('pipe1', temp);
            data.forEach(element => {
                template[element.field_name] = {}
            })

            data.forEach(element => {
                template[element.field_name][element.field_id] = element.field_translate

            })

            for (let ele in template) {
                let test = []
                for (let p in template[ele]) {
                    // console.log(p, template[ele][p]);

                    test.push({ 'name': template[ele][p], 'value': Number(p) })

                }
                template[ele] = test
            }
            this.globals.pipe = temp;
            this.globals.pipeDropdown = template;
            this.globals.pipeCols = pipeCol

            console.log('pipe2', template);

            // console.log(tempPipe);
        })
        // this.httpClient.get(baseUrlLevel).subscribe((data: any[]) => {
        //     data.forEach(element => {
        //         this.globals.educations[element.dim] = element.name;
        //     });
        //     // console.log('education', this.globals.educations)
        // });
        // this.httpClient.get(baseUrlMarried).subscribe((data: any[]) => {
        //     data.forEach(element => {
        //         this.globals.married[element.statusid] = element.title;
        //     });
        // });
    }
}
