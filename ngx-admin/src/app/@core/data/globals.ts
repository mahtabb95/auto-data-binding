import { Injectable } from "@angular/core";


@Injectable()
export class Globals {
    pipeCols = [];
    educations = new Map<number, string>();
    married = new Map<number, string>();
    pipe = new Map<string, any>()
    pipeDropdown = new Map<string, any>()
}
