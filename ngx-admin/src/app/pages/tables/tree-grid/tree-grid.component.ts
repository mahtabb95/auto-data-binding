// import { Component, Input } from '@angular/core';
// import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbDateService } from '@nebular/theme';
// // import { LocalDataSource } from 'ng2-smart-table';
// import { FormGroup, FormControl } from '@angular/forms';
// import { ApiService } from '../../../api.service';

// interface TreeNode<T> {
//   data: T;
//   children?: TreeNode<T>[];
//   expanded?: boolean;
// }

// interface FSEntry {
//   name: string;
//   size: string;
//   kind: string;
//   items?: number;
//   file?: string;
// }

// @Component({
//   selector: 'ngx-tree-grid',
//   templateUrl: './tree-grid.component.html',
//   styleUrls: ['./tree-grid.component.scss'],
// })
// export class TreeGridComponent {
//   calendarVal;
//   id = null;
//   books;
//   selectedBook = null;
//   editingBook = null;
//   bookForm;
//   excelData;
//   dateValue = new FormControl();
//   @Input() set book(val: any) {
//     this.id = val.id;
//     this.calendarVal = new Date(val.published);
//     this.bookForm = new FormGroup({
//       title: new FormControl(val.title),
//       writer: new FormControl(val.writer),
//       published: new FormControl(this.calendarVal)
//     });
//   }
//   constructor(private apiService: ApiService) { }
//   ngOnInit(): void {
//     this.apiService.getBooks().subscribe(
//       data => this.books = data,
//       error => console.log(error)
//     )
//   }
//   selectBook(item) {
//     this.selectedBook = item;
//     this.editingBook = null;
//   }
//   editBook(item) {
//     this.selectedBook = null;
//     this.editingBook = item;
//     this.id = item.id;
//     this.bookForm = new FormGroup({
//       title: new FormControl(this.editingBook.title),
//       writer: new FormControl(this.editingBook.writer),
//       published: new FormControl(this.editingBook.published)
//     });
//   }
//   createNewBooks() {
//     this.editingBook = { title: '', writer: '', published: '' }
//     this.bookForm = new FormGroup({
//       title: new FormControl(this.editingBook.title),
//       writer: new FormControl(this.editingBook.writer),
//       published: new FormControl(this.editingBook.published)
//     });
//     this.selectedBook = null
//     this.id = undefined
//     console.log(this.editingBook)
//   }
//   deleteBooks(item) {
//     this.apiService.deleteBook(item.id).subscribe(
//       data => this.books = this.books.filter(boo => boo.id !== item.id),
//       error => console.log(error))
//   }
//   saveForm() {
//     if (this.id) {
//       this.apiService.updateBook(this.id, this.bookForm.value.title, this.bookForm.value.writer, this.bookForm.value.published).subscribe(
//         result => this.bookUpdated(result),
//         error => console.log(error)
//       )
//     } else {
//       this.apiService.createBook(this.bookForm.value.title, this.bookForm.value.writer, this.bookForm.value.published).subscribe(
//         result => this.bookCreated(result),
//         error => console.log(error)
//       )
//     }
//   }
//   bookCreated(books) {
//     books.forEach(element => {
//       this.books.push(element);
//     });
//     this.editingBook = null;
//   }
//   bookUpdated(item) {
//     const indx = this.books.findIndex(boo => boo.id === item.id)
//     if (indx >= 0) {
//       this.books[indx] = item
//     }
//     this.editingBook = null
//   }

//   settings = {
//     add: {
//       addButtonContent: '<i class="nb-plus"></i>',
//       createButtonContent: '<i class="nb-checkmark"></i>',
//       cancelButtonContent: '<i class="nb-close"></i>',
//     },
//     edit: {
//       editButtonContent: '<i class="nb-edit"></i>',
//       saveButtonContent: '<i class="nb-checkmark"></i>',
//       cancelButtonContent: '<i class="nb-close"></i>',
//     },
//     delete: {
//       deleteButtonContent: '<i class="nb-trash"></i>',
//       confirmDelete: true,
//     },
//     columns: {
//       title: {
//         title: 'title',
//         type: 'string',
//       },
//       writer: {
//         title: 'writer',
//         type: 'string',
//       },
//       published: {
//         title: 'published',
//         type: 'date',
//       },
//     }
//   }
//   onDeleteConfirm(event): void {
//     if (window.confirm('Are you sure you want to delete?')) {
//       event.confirm.resolve();
//     } else {
//       event.confirm.reject();
//     }
//   }
//   // source: LocalDataSource = new LocalDataSource();




//   // customColumn = 'name';
//   // defaultColumns = ['size', 'kind', 'items', 'file'];
//   // allColumns = [this.customColumn, ...this.defaultColumns];

//   // dataSource: NbTreeGridDataSource<FSEntry>;

//   // sortColumn: string;
//   // sortDirection: NbSortDirection = NbSortDirection.NONE;

//   // constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {
//   //   this.dataSource = this.dataSourceBuilder.create(this.data);
//   // }

//   // updateSort(sortRequest: NbSortRequest): void {
//   //   this.sortColumn = sortRequest.column;
//   //   this.sortDirection = sortRequest.direction;
//   // }

//   // getSortDirection(column: string): NbSortDirection {
//   //   if (this.sortColumn === column) {
//   //     return this.sortDirection;
//   //   }
//   //   return NbSortDirection.NONE;
//   // }
//   // private data: TreeNode<FSEntry>[] = [
//   //   {
//   //     data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir', file: 'pow' },
//   //     children: [
//   //       { data: { name: 'projecttt-1.doc', kind: 'doc', size: '240 KB', file: 'pow' } },
//   //       { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB', file: 'pow' } },
//   //       { data: { name: 'project-3', kind: 'txt', size: '466 KB', file: 'pow' } },
//   //       { data: { name: 'project-4.docx', kind: 'docx', size: '900 KB', file: 'pow' } },
//   //     ],
//   //   },
//   // ];

//   // getShowOn(index: number) {
//   //   const minWithForMultipleColumns = 400;
//   //   const nextColumnStep = 100;
//   //   return minWithForMultipleColumns + (nextColumnStep * index);
//   // }
// }

// @Component({
//   selector: 'ngx-fs-icon',
//   template: `
//     <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
//     </nb-tree-grid-row-toggle>
//     <ng-template #fileIcon>
//       <nb-icon icon="file-text-outline"></nb-icon>
//     </ng-template>
//   `,
// })
// export class FsIconComponent {
//   @Input() kind: string;
//   @Input() expanded: boolean;

//   isDir(): boolean {
//     return this.kind === 'dir';
//   }
// }
